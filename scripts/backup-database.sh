#!/bin/bash

# Database Backup Script for Dataset Portal

set -e

echo "💾 Database Backup Script"
echo "========================="
echo ""

# Configuration
BACKUP_DIR="/root/backups/dataset-portal"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Database credentials (edit these or source from .env)
DB_USER="${DB_USER:-dataset_user}"
DB_NAME="${DB_NAME:-dataset_portal}"
DB_HOST="${DB_HOST:-localhost}"

# Create backup directory
mkdir -p $BACKUP_DIR

BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"

echo "Backing up database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""

# Perform backup
if PGPASSWORD=$DB_PASS pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > $BACKUP_FILE; then
    # Compress backup
    gzip $BACKUP_FILE
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    echo "✓ Backup created successfully: $BACKUP_FILE"
    
    # Get file size
    SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo "  Size: $SIZE"
    
    # Remove old backups
    echo ""
    echo "Cleaning old backups (older than $RETENTION_DAYS days)..."
    DELETED=$(find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
    echo "✓ Removed $DELETED old backup(s)"
    
    # List current backups
    echo ""
    echo "Current backups:"
    ls -lh $BACKUP_DIR/db_backup_*.sql.gz 2>/dev/null || echo "  No backups found"
    
else
    echo "✗ Backup failed!"
    exit 1
fi

echo ""
echo "Backup completed at: $(date)"
