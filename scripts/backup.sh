#!/bin/bash

# SHAKTI V3 Database Backup Script
# Schedule this via cron: 0 3 * * * /path/to/scripts/backup.sh

BACKUP_DIR="/var/backups/shakti_db"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="shakti_db"
DB_USER="postgres"
DB_NAME="shakti_os"

echo "💾 Starting database backup at $DATE"

mkdir -p "$BACKUP_DIR"

# Run pg_dump inside the container
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

echo "✅ Backup completed: $BACKUP_DIR/db_backup_$DATE.sql.gz"

# Optional: Keep only last 7 days of backups
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;
echo "🧹 Cleaned up old backups."
