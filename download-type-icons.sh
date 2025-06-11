#!/bin/bash

# Script to download official Pokemon type icons from Bulbapedia
# These are the Generation 9 (Scarlet/Violet) type icons

BASE_URL="https://archives.bulbagarden.net/media/upload"
TYPES_DIR="public/types"

# Create types directory if it doesn't exist
mkdir -p "$TYPES_DIR"

# Array of type icons with their Bulbapedia file paths
declare -A type_icons=(
    ["normal"]="6/6c/NormalIC_SV.png"
    ["fighting"]="0/0f/FightingIC_SV.png"
    ["flying"]="b/b5/FlyingIC_SV.png"
    ["poison"]="8/8d/PoisonIC_SV.png"
    ["ground"]="2/27/GroundIC_SV.png"
    ["rock"]="1/11/RockIC_SV.png"
    ["bug"]="9/9c/BugIC_SV.png"
    ["ghost"]="0/01/GhostIC_SV.png"
    ["steel"]="0/05/SteelIC_SV.png"
    ["fire"]="a/ab/FireIC_SV.png"
    ["water"]="8/80/WaterIC_SV.png"
    ["grass"]="a/a8/GrassIC_SV.png"
    ["electric"]="7/7b/ElectricIC_SV.png"
    ["psychic"]="7/73/PsychicIC_SV.png"
    ["ice"]="1/15/IceIC_SV.png"
    ["dragon"]="7/70/DragonIC_SV.png"
    ["dark"]="d/d5/DarkIC_SV.png"
    ["fairy"]="c/c6/FairyIC_SV.png"
)

echo "Downloading Pokemon type icons from Bulbapedia..."

for type in "${!type_icons[@]}"; do
    icon_path="${type_icons[$type]}"
    url="$BASE_URL/$icon_path"
    output_file="$TYPES_DIR/${type}.png"
    
    echo "Downloading $type type icon..."
    curl -s -o "$output_file" "$url"
    
    if [ $? -eq 0 ] && [ -f "$output_file" ]; then
        echo "✓ Downloaded $type.png"
    else
        echo "✗ Failed to download $type.png"
    fi
done

echo "Type icon download complete!"
echo "Icons saved to: $TYPES_DIR"
