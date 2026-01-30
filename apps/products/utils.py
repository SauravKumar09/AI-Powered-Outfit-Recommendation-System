"""
Simple, robust importer for product rows.

Exports: import_products_from_workbook_rows(rows, headers)
Uses ProductCreateSerializer for validation and fills defaults to tolerate missing cells.
"""

from decimal import Decimal
import ast
import random
import uuid
from typing import Iterable, List

from .serializers import ProductCreateSerializer


def _safe_decimal(v, default=0):
    try:
        return Decimal(str(v))
    except Exception:
        return Decimal(default)


def _normalize_tags(raw) -> List[str]:
    if not raw:
        return []
    try:
        parsed = ast.literal_eval(str(raw))
        if isinstance(parsed, (list, tuple)):
            return [str(x).strip() for x in parsed if str(x).strip()]
    except Exception:
        pass
    return [s.strip() for s in str(raw).split(",") if s.strip()]


def _map_category(value: str):
    if not value:
        return "accessory"
    v = str(value).lower()
    if any(k in v for k in ["top", "shirt", "blouse", "t-shirt", "tee"]):
        return "top"
    if any(k in v for k in ["pant", "jean", "trouser", "bottom", "skirt", "short"]):
        return "bottom"
    if any(k in v for k in ["shoe", "sneaker", "footwear", "boot"]):
        return "footwear"
    return "accessory"


def _map_gender(value: str):
    if not value:
        return "unisex"
    v = str(value).lower()
    if "male" in v or v == "m":
        return "male"
    if "female" in v or v == "f":
        return "female"
    return "unisex"


def _map_style(value: str):
    styles = ["formal", "smart_casual", "casual", "sporty"]
    if not value:
        return random.choice(styles)
    v = str(value).lower()
    if "formal" in v:
        return "formal"
    if "smart" in v:
        return "smart_casual"
    if "casual" in v:
        return "casual"
    if "sport" in v:
        return "sporty"
    return random.choice(styles)


def _map_price_range(price: Decimal) -> str:
    try:
        p = Decimal(price)
    except Exception:
        return ""
    if p < 20:
        return "budget"
    if p < 100:
        return "mid"
    if p < 300:
        return "premium"
    return "luxury"


def import_products_from_workbook_rows(rows: Iterable, headers: List[str]):
    """
    rows: iterable of row tuples
    headers: list of header names (strings) corresponding to columns

    Returns: { 'created': int, 'errors': [ {row: int, errors: dict, payload: dict}, ... ] }
    """
    created = 0
    errors = []
    sample_colors = ["black", "white", "navy", "red", "green", "beige", "brown", "gray"]

    for idx_row, row in enumerate(rows, start=2):
        if row is None or all(
            cell is None or (isinstance(cell, str) and not cell.strip()) for cell in row
        ):
            continue

        data = {}
        for i, cell in enumerate(row):
            if i >= len(headers):
                continue
            key = (headers[i] or "").strip().lower()
            if not key:
                continue
            data[key] = cell

        title = (
            data.get("title") or data.get("name") or f"Product {str(uuid.uuid4())[:8]}"
        )
        sku = data.get("sku_id") or data.get("sku") or f"SKU-{str(uuid.uuid4())[:8]}"
        category = _map_category(data.get("category") or data.get("sector") or "")
        sub_category = data.get("sub_category") or data.get("product_type") or ""
        color = data.get("color") or random.choice(sample_colors)
        image_url = data.get("featured_image") or data.get("image_url") or ""
        style = _map_style(data.get("product_type") or data.get("style") or "")
        gender = _map_gender(data.get("gender") or "")

        price_raw = data.get("lowest_price") or data.get("price") or 0
        price_val = _safe_decimal(price_raw, default=0)
        price_range = data.get("price_range") or _map_price_range(price_val)

        tags = _normalize_tags(
            data.get("tags") or data.get("tag") or data.get("labels")
        )
        brand = data.get("brand_name") or data.get("brand")
        if brand:
            tags.insert(0, str(brand))

        occasions = (
            _normalize_tags(data.get("occasions")) if data.get("occasions") else []
        )
        seasons = _normalize_tags(data.get("seasons")) if data.get("seasons") else []

        payload = {
            "name": str(title),
            "category": category,
            "sub_category": str(sub_category) or "",
            "color": str(color),
            "image_url": str(image_url) or "",
            "style": style,
            "gender": gender,
            "price": float(price_val),
            "price_range": price_range or "",
            "tags": tags,
            "occasions": occasions,
            "seasons": seasons,
            "sku": str(sku),
            "description": str(data.get("description") or ""),
        }

        try:
            serializer = ProductCreateSerializer(data=payload)
            if serializer.is_valid():
                serializer.save()
                created += 1
            else:
                errors.append(
                    {"row": idx_row, "errors": serializer.errors, "payload": payload}
                )
        except Exception as exc:
            errors.append({"row": idx_row, "errors": str(exc), "payload": payload})

    return {"created": created, "errors": errors}
