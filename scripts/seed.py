#!/usr/bin/env python3
"""Generate test data for development. NEVER use real PII (ISO-831-NOREAL)."""

import json
from datetime import datetime, timezone


def generate_test_users(count: int = 10) -> list[dict]:
    """Generate fake test users."""
    users = []
    for i in range(count):
        users.append({
            "email": f"testuser{i}@example.com",
            "display_name": f"Test User {i}",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    return users


if __name__ == "__main__":
    users = generate_test_users()
    print(json.dumps(users, indent=2))
    print(f"\nGenerated {len(users)} test users.")
