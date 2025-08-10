#!/bin/bash

# Neill Beauty - SQLite Database Backup Script
# This script creates a backup of all SQLite databases in the data directory

BACKUP_DIR="backups"
DATA_DIR="data"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_PATH="${BACKUP_DIR}/backup_${DATE}"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"
mkdir -p "${BACKUP_PATH}"

echo "🔄 Starting backup process..."
echo "📅 Date: ${DATE}"
echo "📁 Backup location: ${BACKUP_PATH}"

# Check if data directory exists
if [ ! -d "${DATA_DIR}" ]; then
    echo "❌ Data directory not found: ${DATA_DIR}"
    exit 1
fi

# Count databases
DB_COUNT=$(find "${DATA_DIR}" -name "*.sqlite" -type f | wc -l)
echo "📊 Found ${DB_COUNT} SQLite databases to backup"

if [ ${DB_COUNT} -eq 0 ]; then
    echo "⚠️  No SQLite databases found in ${DATA_DIR}"
    exit 1
fi

# Backup each database
BACKED_UP=0
for db in "${DATA_DIR}"/*.sqlite; do
    if [ -f "$db" ]; then
        db_name=$(basename "$db")
        backup_file="${BACKUP_PATH}/${db_name}"
        
        echo "📦 Backing up: ${db_name}"
        
        # Use sqlite3 to create a proper backup
        if command -v sqlite3 &> /dev/null; then
            sqlite3 "$db" ".backup '${backup_file}'"
        else
            # Fallback to simple copy if sqlite3 is not available
            cp "$db" "$backup_file"
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully backed up: ${db_name}"
            BACKED_UP=$((BACKED_UP + 1))
        else
            echo "❌ Failed to backup: ${db_name}"
        fi
    fi
done

# Create backup info file
cat > "${BACKUP_PATH}/backup_info.txt" << EOF
Neill Beauty Database Backup
============================
Date: ${DATE}
Total databases found: ${DB_COUNT}
Successfully backed up: ${BACKED_UP}
Backup location: ${BACKUP_PATH}

Files backed up:
EOF

ls -la "${BACKUP_PATH}"/*.sqlite >> "${BACKUP_PATH}/backup_info.txt" 2>/dev/null

# Create compressed archive
if command -v tar &> /dev/null; then
    echo "🗜️  Creating compressed archive..."
    tar -czf "${BACKUP_PATH}.tar.gz" -C "${BACKUP_DIR}" "backup_${DATE}"
    
    if [ $? -eq 0 ]; then
        echo "📦 Archive created: ${BACKUP_PATH}.tar.gz"
        # Remove uncompressed backup directory
        rm -rf "${BACKUP_PATH}"
    fi
fi

echo "🎉 Backup completed successfully!"
echo "📁 Backup saved to: ${BACKUP_PATH}.tar.gz"
echo ""
echo "💡 To restore a database, extract the archive and copy the .sqlite files back to the data directory"