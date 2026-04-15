{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "font-tai-cloudflare",
  "main": "src/worker.ts",
  "compatibility_date": "2026-04-15",

  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  },

  "vars": {
    "APP_NAME": "font-tai-cloudflare",
    "ADMIN_USERNAME": "admin",
    "ADMIN_PASSWORD_HASH": "ใส่ค่าแฮชจริงของ 123456",
    "SESSION_SECRET": "fonttai_secret_2026_super_long_random_key"
  },

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "font_tai_db",
      "database_id": "9a48f6f5-567a-4d69-9323-d3e9b0a6eacc"
    },
    {
      "binding": "font_tai_db",
      "database_name": "font_tai_db",
      "database_id": "9a48f6f5-567a-4d69-9323-d3e9b0a6eacc",
      "remote": true
    }
  ],

  "r2_buckets": [
    {
      "binding": "FONT_BUCKET",
      "bucket_name": "font-tai-files"
    }
  ]
}