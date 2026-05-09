"""Seed The Essence with realistic e-commerce data.

Run: python manage.py seed [--flush]
"""
from __future__ import annotations

import random
from datetime import timedelta
from decimal import Decimal
from typing import Any

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.cms.models import Banner, Concern, DiscountCode
from apps.products.models import (
    Category,
    Product,
    ProductConcern,
    ProductImage,
    ProductTag,
)
from apps.reviews.models import Review, refresh_product_rating

User = get_user_model()

UNSPLASH = (
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800",
    "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800",
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800",
    "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800",
    "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=800",
    "https://images.unsplash.com/photo-1612229109739-2b65d1d2e8e1?w=800",
    "https://images.unsplash.com/photo-1583241800698-9c2e7a8c4e90?w=800",
    "https://images.unsplash.com/photo-1581059729226-c493d3086748?w=800",
)

CATEGORIES: list[dict[str, Any]] = [
    {
        "name": "Serums",
        "slug": "serums",
        "description": "Targeted, high-concentration formulas for visible results.",
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200",
    },
    {
        "name": "Moisturizers",
        "slug": "moisturizers",
        "description": "Hydration that restores, balances and protects the skin barrier.",
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200",
    },
    {
        "name": "Cleansers",
        "slug": "cleansers",
        "description": "Daily essentials to remove makeup, oil and impurities.",
        "image_url": "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200",
    },
    {
        "name": "Eye Care",
        "slug": "eye-care",
        "description": "Dedicated formulas for the most delicate area of the face.",
        "image_url": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200",
    },
    {
        "name": "Sun Care",
        "slug": "sun-care",
        "description": "Broad-spectrum protection against UV exposure and pollution.",
        "image_url": "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=1200",
    },
    {
        "name": "Hair Care",
        "slug": "hair-care",
        "description": "Scalp-first hair care rooted in dermatological science.",
        "image_url": "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=1200",
    },
    {
        "name": "Body Care",
        "slug": "body-care",
        "description": "Treat the body with the same actives you trust on your face.",
        "image_url": "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=1200",
    },
    {
        "name": "Tools",
        "slug": "tools",
        "description": "Applicators, brushes and devices that elevate your routine.",
        "image_url": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200",
    },
]

CONCERNS = [
    ("Hydration", "hydration", "Restore moisture and plump the skin barrier."),
    ("Anti-Aging", "anti-aging", "Visibly soften lines and even tone over time."),
    ("Brightening", "brightening", "Reduce dullness and improve radiance."),
    ("Acne & Blemishes", "acne", "Calm breakouts and decongest pores."),
    ("Sensitive Skin", "sensitive-skin", "Gentle, fragrance-free formulas."),
    ("Hair Care", "hair-care", "Stronger roots, healthier ends."),
]

PRODUCT_TAGS_POOL = [
    "Vegan",
    "Cruelty-Free",
    "Fragrance-Free",
    "Sulfate-Free",
    "Paraben-Free",
    "Dermatologically Tested",
]


def _make_products() -> list[dict[str, Any]]:
    return [
        # Serums (1-10)
        {
            "name": "Niacinamide 10% + Zinc 1%",
            "slug": "niacinamide-10-zinc-1",
            "category": "serums",
            "tagline": "High-strength vitamin and mineral blemish formula",
            "key_ingredients": "Niacinamide 10% + Zinc 1%",
            "description": "A water-based serum with a high 10% concentration of Niacinamide supported by Zinc PCA at 1%. Indicated to reduce the appearance of skin blemishes and congestion.",
            "ingredients": "Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Acacia Senegal Gum, Carrageenan, Trisodium Ethylenediamine Disuccinate, Phenoxyethanol, Chlorphenesin.",
            "how_to_use": "Apply a few drops to face morning and evening before heavier creams. Avoid the eye contour.",
            "price": 6.90,
            "compare_price": 8.90,
            "stock_qty": 240,
            "is_featured": True,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Acne & Blemishes", "Hydration"],
        },
        {
            "name": "Hyaluronic Acid 2% + B5",
            "slug": "hyaluronic-acid-2-b5",
            "category": "serums",
            "tagline": "Multi-depth hydration",
            "key_ingredients": "Hyaluronic Acid 2% + Vitamin B5",
            "description": "A combination of low, medium and high molecular weight hyaluronic acid plus a next-gen HA crosspolymer offers multi-depth hydration in a concentrated water-based serum.",
            "ingredients": "Aqua, Sodium Hyaluronate, Sodium Hyaluronate Crosspolymer, Panthenol, Pentylene Glycol, Propanediol, Glycerin, Trisodium Ethylenediamine Disuccinate, Citric Acid, PPG-26-Buteth-26, PEG-40 Hydrogenated Castor Oil, Ethylhexylglycerin, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening to clean skin before creams.",
            "price": 8.50,
            "stock_qty": 320,
            "is_featured": True,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration"],
        },
        {
            "name": "Retinol 0.5% in Squalane",
            "slug": "retinol-0-5-in-squalane",
            "category": "serums",
            "tagline": "Moderate-strength retinol for early signs of aging",
            "key_ingredients": "Retinol 0.5% in stabilized squalane base",
            "description": "A moderate-strength retinol in a squalane base for visible reduction of fine lines, photo-damage and uneven skin tone.",
            "ingredients": "Squalane, Caprylic/Capric Triglyceride, Retinol, Solanum Lycopersicum (Tomato) Fruit Extract, Simmondsia Chinensis (Jojoba) Seed Oil, BHT.",
            "how_to_use": "Apply a small amount to face in the PM only. Always use SPF in the morning.",
            "price": 9.20,
            "compare_price": 12.50,
            "stock_qty": 180,
            "is_featured": True,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Vitamin C Suspension 23%",
            "slug": "vitamin-c-suspension-23",
            "category": "serums",
            "tagline": "Brightening antioxidant treatment",
            "key_ingredients": "L-Ascorbic Acid 23%",
            "description": "A high-strength vitamin C in a silicone base, offering improved radiance and reduced signs of aging.",
            "ingredients": "Ascorbic Acid, Squalane, Isodecyl Neopentanoate, Coconut Alkanes, Ethylene/Propylene/Styrene Copolymer, Polyhydroxystearic Acid, BHT.",
            "how_to_use": "Apply once daily, evenings preferable. Tingling on application is normal.",
            "price": 7.40,
            "stock_qty": 210,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Brightening", "Anti-Aging"],
        },
        {
            "name": "Alpha Arbutin 2% + HA",
            "slug": "alpha-arbutin-2-ha",
            "category": "serums",
            "tagline": "Targeted serum for uneven skin tone",
            "key_ingredients": "Alpha Arbutin 2% + Hyaluronic Acid",
            "description": "A high-concentration alpha arbutin serum that helps reduce the look of dark spots and post-blemish marks while delivering hyaluronic acid hydration.",
            "ingredients": "Aqua, Alpha-Arbutin, Sodium Hyaluronate, Glycerin, Propanediol, Acacia Senegal Gum, Xanthan Gum, Trisodium Ethylenediamine Disuccinate, Phenoxyethanol, Chlorphenesin.",
            "how_to_use": "Apply small amount AM and PM to clean skin. Always use SPF.",
            "price": 8.90,
            "stock_qty": 150,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "Salicylic Acid 2% Solution",
            "slug": "salicylic-acid-2-solution",
            "category": "serums",
            "tagline": "Targeted blemish treatment",
            "key_ingredients": "Salicylic Acid 2%",
            "description": "Direct-acting BHA solution that exfoliates inside the pore lining for clearer skin and fewer blemishes.",
            "ingredients": "Aqua, Salicylic Acid, Witch Hazel Distillate, Dimethyl Isosorbide, Polysorbate 20, Trisodium Ethylenediamine Disuccinate, Phenoxyethanol.",
            "how_to_use": "Apply only on blemishes once daily. Avoid surrounding skin.",
            "price": 5.40,
            "stock_qty": 280,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Acne & Blemishes"],
        },
        {
            "name": "Lactic Acid 10% + HA",
            "slug": "lactic-acid-10-ha",
            "category": "serums",
            "tagline": "Mild exfoliation with hydration",
            "key_ingredients": "Lactic Acid 10% + Hyaluronic Acid",
            "description": "A mild-strength alpha hydroxy acid superficial peel for surface exfoliation, brightening and skin renewal.",
            "ingredients": "Aqua, Lactic Acid, Glycerin, Sodium Hyaluronate Crosspolymer, Pentylene Glycol, Tasmannia Lanceolata Fruit/Leaf Extract, Triethanolamine, Acacia Senegal Gum, Xanthan Gum, Phenoxyethanol.",
            "how_to_use": "PM only, 2-3 times per week. Wear SPF the next morning.",
            "price": 6.20,
            "stock_qty": 200,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "Argireline Solution 10%",
            "slug": "argireline-solution-10",
            "category": "serums",
            "tagline": "Expression-line softening peptide",
            "key_ingredients": "Acetyl Hexapeptide-8 (Argireline) 10%",
            "description": "A topical solution that helps reduce the look of dynamic expression lines.",
            "ingredients": "Aqua, Acetyl Hexapeptide-8, Glycerin, Pentylene Glycol, Hydroxyethylcellulose, Sodium Chloride, Trisodium Ethylenediamine Disuccinate, Sodium Citrate, Citric Acid, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening to areas of expression.",
            "price": 8.10,
            "stock_qty": 130,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Buffet Multi-Peptide Serum",
            "slug": "buffet-multi-peptide-serum",
            "category": "serums",
            "tagline": "Multi-technology peptide serum",
            "key_ingredients": "Matrixyl 3000, Argireline, SYN-AKE, Relistase",
            "description": "A combination of leading peptide technologies addressing multiple signs of aging at once.",
            "ingredients": "Aqua, Glycerin, Lactobacillus Ferment, Acetyl Hexapeptide-8, Pentapeptide-18, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Sodium Hyaluronate Crosspolymer, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening to clean skin.",
            "price": 14.80,
            "compare_price": 18.00,
            "stock_qty": 110,
            "is_featured": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging", "Hydration"],
        },
        {
            "name": "Granactive Retinoid 2% Emulsion",
            "slug": "granactive-retinoid-2-emulsion",
            "category": "serums",
            "tagline": "Next-generation retinoid emulsion",
            "key_ingredients": "Hydroxypinacolone Retinoate 2%",
            "description": "A water-based emulsion offering retinoid benefits without the typical irritation.",
            "ingredients": "Aqua, Caprylic/Capric Triglyceride, Cetyl Ethylhexanoate, Hydroxypinacolone Retinoate, Tasmannia Lanceolata Fruit/Leaf Extract, Glycerin, Phenoxyethanol.",
            "how_to_use": "PM only. Always wear SPF.",
            "price": 12.30,
            "stock_qty": 95,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging"],
        },
        # Moisturizers (11-15)
        {
            "name": "Natural Moisturizing Factors + HA",
            "slug": "natural-moisturizing-factors-ha",
            "category": "moisturizers",
            "tagline": "Lightweight everyday moisturizer",
            "key_ingredients": "Amino Acids, Hyaluronic Acid, Ceramides",
            "description": "A surface hydration formula based on natural moisturizing factors plus hyaluronic acid for non-greasy daily comfort.",
            "ingredients": "Aqua, Cetyl Alcohol, Caprylic/Capric Triglyceride, Glycerin, Sodium PCA, PCA, Lactic Acid, Sodium Lactate, Arginine, Sodium Hyaluronate, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening as the last skincare step.",
            "price": 5.50,
            "stock_qty": 360,
            "is_featured": True,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration", "Sensitive Skin"],
        },
        {
            "name": "Squalane Cream",
            "slug": "squalane-cream",
            "category": "moisturizers",
            "tagline": "Plant-derived hydrator",
            "key_ingredients": "Plant-Derived Squalane",
            "description": "A lightweight cream that helps support softness with minimal feel.",
            "ingredients": "Aqua, Squalane, Cetearyl Olivate, Sorbitan Olivate, Caprylyl Glycol, Phenoxyethanol.",
            "how_to_use": "Apply AM and PM to clean skin.",
            "price": 7.90,
            "stock_qty": 240,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration"],
        },
        {
            "name": "Marula Oil Booster",
            "slug": "marula-oil-booster",
            "category": "moisturizers",
            "tagline": "Cold-pressed virgin marula oil",
            "key_ingredients": "100% Virgin Marula Oil",
            "description": "A 100% pure cold-pressed oil rich in fatty acids and antioxidants.",
            "ingredients": "Sclerocarya Birrea Seed Oil.",
            "how_to_use": "Apply a few drops as the last step in PM routine.",
            "price": 9.90,
            "stock_qty": 140,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration", "Anti-Aging"],
        },
        {
            "name": "Barrier Restore Cream",
            "slug": "barrier-restore-cream",
            "category": "moisturizers",
            "tagline": "Ceramide-rich barrier cream",
            "key_ingredients": "Ceramides NP, AP, EOP, Phytosphingosine, Cholesterol",
            "description": "A rich emollient cream with multi-ceramide complex to support skin barrier function.",
            "ingredients": "Aqua, Caprylic/Capric Triglyceride, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening to clean skin.",
            "price": 11.40,
            "stock_qty": 170,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free", "Dermatologically Tested"],
            "concerns": ["Sensitive Skin", "Hydration"],
        },
        {
            "name": "Rich Night Recovery Cream",
            "slug": "rich-night-recovery-cream",
            "category": "moisturizers",
            "tagline": "Overnight nourishing treatment",
            "key_ingredients": "Squalane, Bisabolol, Vitamin E",
            "description": "An overnight cream that nourishes and visibly supports radiance by morning.",
            "ingredients": "Aqua, Glycerin, Caprylic/Capric Triglyceride, Squalane, Cetearyl Alcohol, Bisabolol, Tocopherol, Phenoxyethanol.",
            "how_to_use": "Apply generously in the evening.",
            "price": 13.80,
            "stock_qty": 120,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Anti-Aging", "Hydration"],
        },
        # Cleansers (16-20)
        {
            "name": "Gentle Cleansing Gel",
            "slug": "gentle-cleansing-gel",
            "category": "cleansers",
            "tagline": "Daily clarifying gel cleanser",
            "key_ingredients": "Aloe, Glycerin, Allantoin",
            "description": "A non-stripping gel cleanser that removes everyday impurities while supporting skin comfort.",
            "ingredients": "Aqua, Sodium Cocoamphoacetate, Coco-Glucoside, Glycerin, Aloe Barbadensis Leaf Juice, Allantoin, Phenoxyethanol.",
            "how_to_use": "Use morning and evening on damp skin.",
            "price": 10.20,
            "stock_qty": 230,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Sulfate-Free"],
            "concerns": ["Sensitive Skin"],
        },
        {
            "name": "Squalane Cleansing Balm",
            "slug": "squalane-cleansing-balm",
            "category": "cleansers",
            "tagline": "Melts makeup, leaves skin soft",
            "key_ingredients": "Squalane",
            "description": "A balm-to-oil cleanser that melts makeup and SPF without stripping the skin.",
            "ingredients": "Squalane, Caprylic/Capric Triglyceride, PEG-20 Methyl Glucose Sesquistearate, Tocopherol.",
            "how_to_use": "Massage into dry skin, then rinse with warm water.",
            "price": 12.40,
            "stock_qty": 180,
            "is_featured": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Sensitive Skin", "Hydration"],
        },
        {
            "name": "AHA 30% + BHA 2% Peeling Solution",
            "slug": "aha-30-bha-2-peeling-solution",
            "category": "cleansers",
            "tagline": "10-minute exfoliating mask",
            "key_ingredients": "Glycolic, Lactic, Tartaric, Citric Acids + Salicylic Acid 2%",
            "description": "A high-strength acid peel for experienced users — leaves skin smooth and radiant.",
            "ingredients": "Aqua, Glycolic Acid, Aloe Barbadensis Leaf Water, Sodium Hydroxide, Daucus Carota Sativa Extract, Lactic Acid, Tartaric Acid, Citric Acid, Salicylic Acid, Tasmannia Lanceolata Fruit/Leaf Extract.",
            "how_to_use": "Apply once weekly, leave on for no more than 10 minutes, then rinse.",
            "price": 7.20,
            "stock_qty": 90,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "Glycolic Acid 7% Toning Solution",
            "slug": "glycolic-acid-7-toning-solution",
            "category": "cleansers",
            "tagline": "Daily exfoliating toner",
            "key_ingredients": "Glycolic Acid 7%",
            "description": "An exfoliating toner that improves clarity and radiance over time.",
            "ingredients": "Aqua, Glycolic Acid, Rosa Damascena Flower Water, Centaurea Cyanus Flower Water, Aloe Barbadensis Leaf Water, Aminomethyl Propanol, Glycerin, Tasmannia Lanceolata Fruit/Leaf Extract, Hexylene Glycol, Phenoxyethanol.",
            "how_to_use": "Apply with cotton pad in the evening. Always wear SPF.",
            "price": 8.80,
            "stock_qty": 220,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "Charcoal Detox Foam",
            "slug": "charcoal-detox-foam",
            "category": "cleansers",
            "tagline": "Deep-cleansing foam",
            "key_ingredients": "Activated Charcoal, Salicylic Acid",
            "description": "A foaming cleanser with activated charcoal for purifying congested skin.",
            "ingredients": "Aqua, Sodium Lauroyl Methyl Isethionate, Charcoal Powder, Salicylic Acid, Glycerin, Phenoxyethanol.",
            "how_to_use": "Lather and massage on damp skin, rinse thoroughly.",
            "price": 9.40,
            "stock_qty": 175,
            "tags": ["Vegan", "Cruelty-Free", "Sulfate-Free"],
            "concerns": ["Acne & Blemishes"],
        },
        # Eye Care (21-24)
        {
            "name": "Caffeine Solution 5% + EGCG",
            "slug": "caffeine-solution-5-egcg",
            "category": "eye-care",
            "tagline": "De-puffing eye serum",
            "key_ingredients": "Caffeine 5% + EGCG",
            "description": "A high-concentration caffeine and EGCG eye serum to reduce the look of puffiness and dark circles.",
            "ingredients": "Aqua, Caffeine, Pentylene Glycol, Glycerin, Trisodium Ethylenediamine Disuccinate, Epigallocatechin Gallatyl Glucoside, Cetyl-PG Hydroxyethyl Palmitamide, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening to eye contour.",
            "price": 7.30,
            "stock_qty": 260,
            "is_featured": True,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging", "Brightening"],
        },
        {
            "name": "Restorative Eye Cream",
            "slug": "restorative-eye-cream",
            "category": "eye-care",
            "tagline": "Nourishing peptide eye cream",
            "key_ingredients": "Peptides, Squalane, Caffeine",
            "description": "A rich eye cream blending peptides and antioxidants for visibly smoother, brighter eyes.",
            "ingredients": "Aqua, Squalane, Caffeine, Acetyl Hexapeptide-8, Niacinamide, Glycerin, Tocopherol, Phenoxyethanol.",
            "how_to_use": "Pat gently around the eye area morning and evening.",
            "price": 14.90,
            "stock_qty": 110,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Brightening Eye Serum",
            "slug": "brightening-eye-serum",
            "category": "eye-care",
            "tagline": "Targets dark circles",
            "key_ingredients": "Vitamin C, Niacinamide, Hyaluronic Acid",
            "description": "A lightweight serum to refresh and brighten the eye contour.",
            "ingredients": "Aqua, Niacinamide, Sodium Ascorbyl Phosphate, Sodium Hyaluronate, Glycerin, Caffeine, Phenoxyethanol.",
            "how_to_use": "Apply gently with ring finger AM and PM.",
            "price": 11.50,
            "stock_qty": 150,
            "is_new": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "Hydrating Eye Gel",
            "slug": "hydrating-eye-gel",
            "category": "eye-care",
            "tagline": "Cooling hydration",
            "key_ingredients": "Hyaluronic Acid, Aloe, Cucumber Extract",
            "description": "A cooling gel that immediately quenches dehydrated eye contours.",
            "ingredients": "Aqua, Aloe Barbadensis Leaf Juice, Sodium Hyaluronate, Cucumis Sativus Fruit Extract, Glycerin, Phenoxyethanol.",
            "how_to_use": "Apply morning and evening or whenever needed.",
            "price": 9.20,
            "stock_qty": 200,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration"],
        },
        # Sun Care (25-28)
        {
            "name": "Mineral UV Filters SPF 30",
            "slug": "mineral-uv-filters-spf-30",
            "category": "sun-care",
            "tagline": "Lightweight mineral SPF",
            "key_ingredients": "Zinc Oxide, Titanium Dioxide",
            "description": "A 100% mineral broad-spectrum SPF 30 sunscreen with antioxidant protection.",
            "ingredients": "Aqua, Zinc Oxide, Titanium Dioxide, Glycerin, Caprylic/Capric Triglyceride, Tocopherol, Phenoxyethanol.",
            "how_to_use": "Apply liberally as the last step of your AM routine.",
            "price": 13.50,
            "stock_qty": 220,
            "is_featured": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Daily Defense SPF 50",
            "slug": "daily-defense-spf-50",
            "category": "sun-care",
            "tagline": "High UV protection",
            "key_ingredients": "Avobenzone, Octinoxate, Niacinamide",
            "description": "Lightweight broad-spectrum SPF 50 with antioxidant niacinamide.",
            "ingredients": "Aqua, Octinoxate, Avobenzone, Octocrylene, Niacinamide, Glycerin, Phenoxyethanol.",
            "how_to_use": "Apply 15 minutes before sun exposure.",
            "price": 16.80,
            "stock_qty": 180,
            "is_new": True,
            "tags": ["Cruelty-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Tinted Mineral SPF 30",
            "slug": "tinted-mineral-spf-30",
            "category": "sun-care",
            "tagline": "Sheer tint with mineral protection",
            "key_ingredients": "Zinc Oxide, Iron Oxides",
            "description": "A sheer tint mineral SPF 30 that evens skin tone without heaviness.",
            "ingredients": "Aqua, Zinc Oxide, CI 77491, CI 77492, CI 77499, Caprylic/Capric Triglyceride, Glycerin, Tocopherol.",
            "how_to_use": "Apply evenly across face and neck before sun exposure.",
            "price": 15.20,
            "stock_qty": 140,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "After-Sun Recovery Gel",
            "slug": "after-sun-recovery-gel",
            "category": "sun-care",
            "tagline": "Cooling, calming, hydrating",
            "key_ingredients": "Aloe Vera, Panthenol, Bisabolol",
            "description": "A soothing gel that calms and rehydrates skin after sun exposure.",
            "ingredients": "Aqua, Aloe Barbadensis Leaf Juice, Panthenol, Bisabolol, Glycerin, Phenoxyethanol.",
            "how_to_use": "Apply generously on sun-exposed skin.",
            "price": 8.20,
            "stock_qty": 200,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration", "Sensitive Skin"],
        },
        # Hair Care (29-32)
        {
            "name": "Multi-Peptide Hair Density Serum",
            "slug": "multi-peptide-hair-density-serum",
            "category": "hair-care",
            "tagline": "Visibly fuller, denser-looking hair",
            "key_ingredients": "REDENSYL, PROCAPIL, BAICAPIL",
            "description": "A scalp serum that combines leading peptide and follicle technologies for visibly thicker hair.",
            "ingredients": "Aqua, Glycerin, Larix Europaea Wood Extract, Camellia Sinensis Leaf Extract, Glycine, Zinc Chloride, Caffeine, Niacinamide, Acetyl Tetrapeptide-3, Apigenin, Oleanolic Acid, Biotinoyl Tripeptide-1, Phenoxyethanol.",
            "how_to_use": "Apply 6-8 drops to clean, damp scalp and massage. Do not rinse.",
            "price": 17.90,
            "compare_price": 21.50,
            "stock_qty": 95,
            "is_featured": True,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Hair Care"],
        },
        {
            "name": "Sulfate-Free Strengthening Shampoo",
            "slug": "sulfate-free-strengthening-shampoo",
            "category": "hair-care",
            "tagline": "Daily strengthening shampoo",
            "key_ingredients": "Behentrimonium Methosulfate, Caffeine, Niacinamide",
            "description": "A sulfate-free shampoo that gently cleanses while supporting stronger hair.",
            "ingredients": "Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Caffeine, Niacinamide, Phenoxyethanol.",
            "how_to_use": "Lather, massage scalp, rinse thoroughly. Repeat if needed.",
            "price": 11.40,
            "stock_qty": 200,
            "tags": ["Sulfate-Free", "Vegan", "Cruelty-Free"],
            "concerns": ["Hair Care"],
        },
        {
            "name": "Behentrimonium Conditioner",
            "slug": "behentrimonium-conditioner",
            "category": "hair-care",
            "tagline": "Daily detangling conditioner",
            "key_ingredients": "Behentrimonium Chloride, Argan Oil, Squalane",
            "description": "A weightless detangling conditioner with squalane and argan oil for softness.",
            "ingredients": "Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Argania Spinosa Kernel Oil, Squalane, Phenoxyethanol.",
            "how_to_use": "Apply mid-length to ends, leave for 1-2 minutes, rinse.",
            "price": 11.90,
            "stock_qty": 180,
            "tags": ["Vegan", "Cruelty-Free", "Sulfate-Free"],
            "concerns": ["Hair Care"],
        },
        {
            "name": "Scalp Exfoliating Treatment",
            "slug": "scalp-exfoliating-treatment",
            "category": "hair-care",
            "tagline": "Salicylic acid scalp treatment",
            "key_ingredients": "Salicylic Acid 2%, Squalane",
            "description": "A pre-wash scalp treatment that supports a healthier scalp environment.",
            "ingredients": "Aqua, Salicylic Acid, Squalane, Glycerin, Phenoxyethanol.",
            "how_to_use": "Apply to dry scalp 15 minutes before shampooing.",
            "price": 12.50,
            "stock_qty": 110,
            "is_new": True,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Hair Care", "Acne & Blemishes"],
        },
        # Body Care (33-36)
        {
            "name": "Glycolic Body Lotion 10%",
            "slug": "glycolic-body-lotion-10",
            "category": "body-care",
            "tagline": "Smoothing exfoliating body lotion",
            "key_ingredients": "Glycolic Acid 10%, Squalane",
            "description": "A leave-on body lotion with glycolic acid for visibly smoother, brighter skin.",
            "ingredients": "Aqua, Glycolic Acid, Glycerin, Squalane, Sodium Hydroxide, Phenoxyethanol.",
            "how_to_use": "Apply to clean, dry body skin in the evening.",
            "price": 14.20,
            "stock_qty": 130,
            "is_bestseller": True,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Brightening"],
        },
        {
            "name": "Niacinamide 5% Body Serum",
            "slug": "niacinamide-5-body-serum",
            "category": "body-care",
            "tagline": "All-over evening skin tone",
            "key_ingredients": "Niacinamide 5%, Zinc PCA",
            "description": "A body serum to even tone, smooth texture and treat congestion.",
            "ingredients": "Aqua, Niacinamide, Zinc PCA, Glycerin, Phenoxyethanol.",
            "how_to_use": "Apply daily to clean skin.",
            "price": 13.40,
            "stock_qty": 160,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Brightening", "Acne & Blemishes"],
        },
        {
            "name": "Squalane Body Oil",
            "slug": "squalane-body-oil",
            "category": "body-care",
            "tagline": "Nourishing dry oil",
            "key_ingredients": "100% Plant-Derived Squalane",
            "description": "A weightless body oil for soft, nourished skin without greasy residue.",
            "ingredients": "Squalane.",
            "how_to_use": "Apply to damp skin after showering.",
            "price": 16.80,
            "stock_qty": 95,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Hydration"],
        },
        {
            "name": "Hand Renewal Cream",
            "slug": "hand-renewal-cream",
            "category": "body-care",
            "tagline": "Anti-aging hand cream",
            "key_ingredients": "Niacinamide, Squalane, Vitamin C",
            "description": "A targeted hand cream blending actives that even tone and protect.",
            "ingredients": "Aqua, Niacinamide, Squalane, Sodium Ascorbyl Phosphate, Glycerin, Phenoxyethanol.",
            "how_to_use": "Apply to hands as needed throughout the day.",
            "price": 9.60,
            "stock_qty": 220,
            "tags": ["Vegan", "Cruelty-Free", "Fragrance-Free"],
            "concerns": ["Anti-Aging"],
        },
        # Tools (37-40)
        {
            "name": "Jade Facial Roller",
            "slug": "jade-facial-roller",
            "category": "tools",
            "tagline": "Cooling massage stone",
            "key_ingredients": "100% genuine jade stone",
            "description": "A genuine jade roller for cooling, depuffing facial massage.",
            "ingredients": "100% jade stone, stainless steel hardware.",
            "how_to_use": "Roll outward and upward across the face for 1-2 minutes.",
            "price": 18.90,
            "stock_qty": 80,
            "tags": ["Cruelty-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Gua Sha Sculpting Stone",
            "slug": "gua-sha-sculpting-stone",
            "category": "tools",
            "tagline": "Lifting and contouring",
            "key_ingredients": "100% rose quartz",
            "description": "A heart-shaped rose quartz gua sha for lymphatic drainage and contouring.",
            "ingredients": "100% rose quartz.",
            "how_to_use": "Use with facial oil, glide along contours of the face.",
            "price": 22.40,
            "stock_qty": 75,
            "tags": ["Cruelty-Free"],
            "concerns": ["Anti-Aging"],
        },
        {
            "name": "Silicone Cleansing Brush",
            "slug": "silicone-cleansing-brush",
            "category": "tools",
            "tagline": "Sonic facial cleansing",
            "key_ingredients": "Medical-grade silicone bristles",
            "description": "A sonic cleansing brush with hypoallergenic silicone bristles.",
            "ingredients": "Medical-grade silicone, ABS plastic, USB-C rechargeable.",
            "how_to_use": "Apply cleanser, glide brush across face for 60 seconds.",
            "price": 39.90,
            "compare_price": 49.90,
            "stock_qty": 50,
            "is_new": True,
            "tags": ["Cruelty-Free"],
            "concerns": ["Acne & Blemishes"],
        },
        {
            "name": "Microfiber Reusable Pads (10 pack)",
            "slug": "microfiber-reusable-pads",
            "category": "tools",
            "tagline": "Sustainable makeup remover",
            "key_ingredients": "Microfiber + organic cotton",
            "description": "Reusable, washable microfiber pads to replace single-use cotton rounds.",
            "ingredients": "70% microfiber, 30% organic cotton.",
            "how_to_use": "Wet with cleanser or micellar water; wash after each use.",
            "price": 12.90,
            "stock_qty": 200,
            "tags": ["Vegan", "Cruelty-Free"],
            "concerns": ["Sensitive Skin"],
        },
    ]


REVIEW_AUTHORS = [
    "Camille L.",
    "Sophie M.",
    "Mehdi R.",
    "Anna K.",
    "Julien P.",
    "Yara H.",
    "Léo D.",
    "Priya S.",
    "Olivia W.",
    "Marcus B.",
    "Aïssatou D.",
    "Theo F.",
    "Inès G.",
    "Noé T.",
    "Élise V.",
]

REVIEW_BODIES = [
    "Genuinely the best skincare purchase I have made all year. Texture is light, results are visible.",
    "Used for three weeks and noticed a real difference in my skin's clarity. The price is unbeatable.",
    "I love the no-fluff branding and the science-led approach. This actually works.",
    "Pleasantly surprised by how gentle this is. Sensitive skin approved.",
    "Glowing reviews are deserved — my skin is calmer and more even after a month.",
    "Took a couple of weeks to kick in but consistency paid off. Will repurchase.",
    "The packaging is minimal and the formula doesn't break me out. Five stars.",
    "Pleasing texture, no fragrance, no greasy residue. Exactly what I wanted.",
    "Mid-tier results in week one, great by week three. Patience required.",
    "Effective but the dropper takes some practice to use without dripping.",
    "Wow. Just wow. The transformation in my routine is real.",
    "Fast shipping, beautiful packaging, formula does what it claims.",
]


class Command(BaseCommand):
    help = "Seed The Essence with realistic e-commerce data"

    def add_arguments(self, parser) -> None:
        parser.add_argument("--flush", action="store_true", help="Wipe existing data first")

    @transaction.atomic
    def handle(self, *args, **options) -> None:
        random.seed(42)
        if options.get("flush"):
            self.stdout.write("Flushing existing data...")
            Review.objects.all().delete()
            ProductImage.objects.all().delete()
            ProductTag.objects.all().delete()
            ProductConcern.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            Banner.objects.all().delete()
            Concern.objects.all().delete()
            DiscountCode.objects.all().delete()
            User.objects.exclude(is_superuser=True).delete()

        self._seed_users()
        self._seed_categories()
        self._seed_concerns()
        self._seed_products()
        self._seed_reviews()
        self._seed_banners()
        self._seed_discount_codes()

        self.stdout.write(self.style.SUCCESS("Seed complete."))
        self.stdout.write("Admin login → admin@theessence.com / admin1234!")
        self.stdout.write("Customer login → customer@theessence.com / customer1234!")

    def _seed_users(self) -> None:
        admins = [
            ("admin@theessence.com", "Devin", "Admin"),
            ("ops@theessence.com", "Operations", "Lead"),
            ("editor@theessence.com", "Content", "Editor"),
        ]
        for email, fn, ln in admins:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": fn,
                    "last_name": ln,
                    "role": User.Role.ADMIN,
                    "is_staff": True,
                    "is_superuser": True,
                },
            )
            if created:
                user.set_password("admin1234!")
                user.save()

        customers = [
            "camille@example.com",
            "sophie@example.com",
            "mehdi@example.com",
            "anna@example.com",
            "julien@example.com",
            "yara@example.com",
            "leo@example.com",
            "priya@example.com",
            "olivia@example.com",
            "marcus@example.com",
            "customer@theessence.com",
        ]
        for email in customers:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "first_name": email.split("@")[0].title(),
                    "last_name": "Customer",
                    "role": User.Role.CUSTOMER,
                },
            )
            if created:
                user.set_password("customer1234!")
                user.save()
        self.stdout.write(f"Users seeded: {User.objects.count()}")

    def _seed_categories(self) -> None:
        for idx, cat in enumerate(CATEGORIES):
            Category.objects.update_or_create(
                slug=cat["slug"],
                defaults={
                    "name": cat["name"],
                    "description": cat["description"],
                    "image_url": cat["image_url"],
                    "display_order": idx,
                },
            )
        self.stdout.write(f"Categories seeded: {Category.objects.count()}")

    def _seed_concerns(self) -> None:
        for idx, (name, slug, desc) in enumerate(CONCERNS):
            Concern.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "description": desc,
                    "image_url": random.choice(UNSPLASH),
                    "display_order": idx,
                },
            )
        self.stdout.write(f"Concerns seeded: {Concern.objects.count()}")

    def _seed_products(self) -> None:
        cat_map = {c.slug: c for c in Category.objects.all()}
        for idx, p in enumerate(_make_products()):
            sku = f"TE-{(idx + 1):04d}"
            product, _ = Product.objects.update_or_create(
                slug=p["slug"],
                defaults={
                    "name": p["name"],
                    "tagline": p["tagline"],
                    "description": p["description"],
                    "ingredients": p["ingredients"],
                    "key_ingredients": p["key_ingredients"],
                    "how_to_use": p["how_to_use"],
                    "sku": sku,
                    "price": Decimal(str(p["price"])),
                    "compare_price": (
                        Decimal(str(p["compare_price"])) if p.get("compare_price") else None
                    ),
                    "stock_qty": p.get("stock_qty", 100),
                    "is_featured": p.get("is_featured", False),
                    "is_bestseller": p.get("is_bestseller", False),
                    "is_new": p.get("is_new", False),
                    "category": cat_map[p["category"]],
                },
            )
            product.images.all().delete()
            product.tags.all().delete()
            product.concerns.all().delete()
            for i in range(3):
                ProductImage.objects.create(
                    product=product,
                    url=UNSPLASH[(idx + i) % len(UNSPLASH)],
                    alt_text=f"{product.name} — view {i + 1}",
                    is_primary=(i == 0),
                    display_order=i,
                )
            for tag in p.get("tags", []):
                ProductTag.objects.create(product=product, tag=tag)
            for concern in p.get("concerns", []):
                ProductConcern.objects.create(product=product, concern=concern)
        self.stdout.write(f"Products seeded: {Product.objects.count()}")

    def _seed_reviews(self) -> None:
        users = list(User.objects.filter(role=User.Role.CUSTOMER))
        for product in Product.objects.all():
            n = random.randint(3, 12)
            ratings: list[int] = []
            for _ in range(n):
                rating = random.choices([5, 4, 3, 2, 1], weights=[55, 25, 12, 5, 3])[0]
                ratings.append(rating)
                Review.objects.create(
                    product=product,
                    user=random.choice(users) if users else None,
                    author_name=random.choice(REVIEW_AUTHORS),
                    rating=rating,
                    title=random.choice(
                        [
                            "Truly impressive",
                            "Has earned its place in my routine",
                            "Subtle but real results",
                            "Solid value",
                            "Will repurchase",
                            "Not what I expected — better",
                            "Gentle and effective",
                        ]
                    ),
                    body=random.choice(REVIEW_BODIES),
                    verified_purchase=random.random() > 0.25,
                    helpful_count=random.randint(0, 35),
                    created_at=timezone.now()
                    - timedelta(days=random.randint(1, 240)),
                )
            refresh_product_rating(product)
        self.stdout.write(f"Reviews seeded: {Review.objects.count()}")

    def _seed_banners(self) -> None:
        slides = [
            (
                "Formulated. Not Fabricated.",
                "Science-Led Skincare. Honest Pricing.",
                "Shop Best Sellers",
                "/products?bestseller=true",
                "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1920",
            ),
            (
                "The Niacinamide Edition",
                "10% Niacinamide + 1% Zinc — your blemish reset.",
                "Discover",
                "/products/niacinamide-10-zinc-1",
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1920",
            ),
            (
                "Free shipping over €30",
                "Plus a complimentary mini with every order.",
                "Shop",
                "/products",
                "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1920",
            ),
            (
                "Build Your Routine",
                "Three steps. Honest pricing. Visible results.",
                "Start the quiz",
                "/products?concern=hydration",
                "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1920",
            ),
            (
                "Vegan. Cruelty-Free.",
                "Always.",
                "Our promise",
                "/about",
                "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=1920",
            ),
        ]
        for idx, (title, subtitle, cta_text, cta_url, image_url) in enumerate(slides):
            Banner.objects.update_or_create(
                title=title,
                defaults={
                    "subtitle": subtitle,
                    "cta_text": cta_text,
                    "cta_url": cta_url,
                    "image_url": image_url,
                    "is_active": True,
                    "display_order": idx,
                },
            )
        self.stdout.write(f"Banners seeded: {Banner.objects.count()}")

    def _seed_discount_codes(self) -> None:
        codes = [
            ("WELCOME10", DiscountCode.Type.PERCENTAGE, Decimal("10"), Decimal("0")),
            ("FREESHIP", DiscountCode.Type.FREE_SHIPPING, Decimal("0"), Decimal("0")),
            ("BUNDLE20", DiscountCode.Type.PERCENTAGE, Decimal("20"), Decimal("50")),
        ]
        for code, ctype, value, min_order in codes:
            DiscountCode.objects.update_or_create(
                code=code,
                defaults={
                    "type": ctype,
                    "value": value,
                    "min_order_amount": min_order,
                    "is_active": True,
                    "expires_at": timezone.now() + timedelta(days=365),
                },
            )
        self.stdout.write(f"Discount codes seeded: {DiscountCode.objects.count()}")
