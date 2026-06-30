#!/bin/bash

# Database Restore Script for Dataset Portal

set -e

echo "🔄 Database Restore Script"
echo "=========================="
echo ""

# Configuration
BACKUP_DIR="/root/backups/dataset-portal"

# Database credentials
DB_USER="${DB_USER:-dataset_user}"
DB_NAME="${DB_NAME:-dataset_portal}"
DB_HOST="${DB_HOST:-localhost}"

# List available backups
echo "Available backups:"
ls -lh $BACKUP_DIR/db_backup_*.sql.gz 2>/dev/null || {
    echo "No backups found in $BACKUP_DIR"
    exit 1
}

echo ""
read -p "Enter backup filename (or full path): " BACKUP_FILE

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    # Try with backup directory
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "Backup file not found!"
        exit 1
    fi
fi

echo ""
echo "WARNING: This will replace the current database!"
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo ""
echo "Creating safety backup of current database..."
SAFETY_BACKUP="$BACKUP_DIR/before_restore_$(date +%Y%m%d_%H%M%S).sql.gz"
PGPASSWORD=$DB_PASS pg_dump -U $DB_USER -h $DB_HOST $DB_NAME | gzip > $SAFETY_BACKUP
echo "✓ Safety backup created: $SAFETY_BACKUP"

echo ""
echo "Restoring database..."

# Drop and recreate database (or just truncate tables)
PGPASSWORD=$DB_PASS psql -U $DB_USER -h $DB_HOST -c "DROP DATABASE IF EXISTS ${DB_NAME};" postgres
PGPASSWORD=$DB_PASS psql -U $DB_USER -h $DB_HOST -c "CREATE DATABASE ${DB_NAME};" postgres

# Restore from backup
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | PGPASSWORD=$DB_PASS psql -U $DB_USER -h $DB_HOST $DB_NAME
else
    PGPASSWORD=$DB_PASS psql -U $DB_USER -h $DB_HOST $DB_NAME < $BACKUP_FILE
fi

echo ""
echo "✓ Database restored successfully!"
echo ""
echo "Safety backup saved at: $SAFETY_BACKUP"
echo "You may want to restart your application:"
echo "  pm2 restart dataset-portal"
