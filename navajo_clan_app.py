#!/usr/bin/env python3
"""
Navajo Clan Application - Version 2
Compares clan relationships between two users with proper Navajo orthography.
"""

from typing import Dict, List, Tuple
from pathlib import Path


class ClanDatabase:
    """Handles Navajo clan data with English translations."""

    def __init__(self, database_file: str):
        self.database_file = database_file
        self.clans: List[Tuple[str, str, str]] = []  # (navajo, english, group)
        self.clan_to_group: Dict[str, str] = {}
        self._load_database()

    def _load_database(self):
        """Load clan data from structured file."""
        with open(self.database_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('['):
                    continue

                # Parse clan entries with 3 columns: Navajo|English|Group
                if '|' in line:
                    parts = line.split('|')
                    if len(parts) >= 3:
                        navajo = parts[0].strip()
                        english = parts[1].strip()
                        group = parts[2].strip()

                        self.clans.append((navajo, english, group))
                        self.clan_to_group[navajo] = group
                    elif len(parts) == 2:
                        # Backward compatibility with old format
                        navajo = parts[0].strip()
                        english = parts[1].strip()
                        group = "Unknown"

                        self.clans.append((navajo, english, group))
                        self.clan_to_group[navajo] = group

        # Clans are already sorted alphabetically in the file
        # No need to sort again

    def find_clan_group(self, clan_name: str) -> str:
        """Find which group a clan belongs to."""
        return self.clan_to_group.get(clan_name, "Unknown")

    def get_all_clans(self) -> List[Tuple[str, str, str]]:
        """Return all clans with translations."""
        return self.clans


def get_hopi_word(english: str) -> str:
    """Return the Hopi word for Hopi clans."""
    hopi_words = {
        "Tobacco": "Pipwungwa",
        "Rabbit": "Tapwungwa",
        "Roadrunner": "Posiwungwa",
        "Sun": "Taawawungwa",
        "Parrot": "Kyarwungwa",
        "Sand": "Tuwawungwa",
        "Rattlesnake": "Tsuaewungwa",
        "Lizard": "Kunkutswungwa",
        "Butterfly": "Poovalwungwa",
        "Cloud": "Oomawaewungwa",
        "Snow": "Nuvaewungwa",
        "Fog": "Pamoswungwa",
        "Coyote": "Iswungwa",
        "Eagle": "Kwaawungwa",
        "Grey Hawk": "Masikwaywungwa",
        "Sparrow Hawk": "Kyelwungwa",
        "Bluebird": "Torswungwa",
        "Squash": "Paatangwungwa",
        "Crane": "Atokwungwa",
        "Water": "Patkiwungwa",
        "Water Coyote": "Paaeiswungwa",
        "Badger": "Honanwungwa",
        "Fire": "",  # No Hopi word provided
        "Bamboo": "Paaqapwungwa",
        "Spider": "Kookyangwungwa",
        "Bear": "Honwungwa",
        "Greasewood": "Tepwungwa",
        "Corn": "Piikyaswungwa",
        "Deer": "Alwungwa"
    }
    return hopi_words.get(english, "")


def get_clan_type_suffix(group: str) -> str:
    """Return the appropriate clan type suffix based on group."""
    if group == "Group 10 (Light Green)":
        return " (Apache clan)"
    elif group == "Group 11 (Light Green)":
        return " (Hopi clan)"
    elif group == "Group 12 (Light Green)":
        return " (Rio Grande Pueblo clan)"
    elif group == "Group 13 (Light Green)":
        return " (Jemez Pueblo clan)"
    elif group == "Group 14 (Light Green)":
        return " (Mount Taylor Pueblo clan)"
    elif group == "Group 15 (Light Green)":
        return " (Zuni clan)"
    elif group == "Group 16 (Light Green)":
        return " (Southern Arizona clan)"
    elif group == "Group 17 (Light Green)":
        return " (Uto-Aztecan clan)"
    elif group == "Group 18 (Light Green)":
        return " (Adopted clan)"
    else:
        return ""


class ClanSelector:
    """Handles user interaction for clan selection."""

    def __init__(self, db: ClanDatabase):
        self.db = db
        self.displayed_clans = []  # Store the reorganized clan list for selection

    def display_clans_numbered(self):
        """Display all clans with numbers, Navajo names, and English names (no groups)."""
        clans = self.db.get_all_clans()

        # Separate clans into Navajo (Groups 1-9) and Adopted (Groups 10-18)
        navajo_clans = []
        adopted_clans = []

        for clan in clans:
            navajo, english, group = clan
            # Extract group number from "Group X (...)"
            if "Group " in group:
                group_num = int(group.split("Group ")[1].split(" ")[0])
                if group_num <= 9:
                    navajo_clans.append(clan)
                else:
                    adopted_clans.append(clan)

        # Store the reorganized clan list: Traditional Navajo first, then Adopted
        self.displayed_clans = navajo_clans + adopted_clans

        print("\n" + "=" * 85)
        print("TRADITIONAL NAVAJO CLANS (Groups 1-9)")
        print("=" * 85)
        print(f"{'#':<5} {'Navajo Name':<40} {'English Name':<40}")
        print("-" * 85)

        counter = 1
        for navajo, english, group in navajo_clans:
            display_english = english + get_clan_type_suffix(group)
            print(f"{counter:<5} {navajo:<40} {display_english:<40}")
            counter += 1

        print("-" * 85)
        print(f"Total Traditional Navajo Clans: {len(navajo_clans)}")
        print("-" * 85)

        print("\n" + "=" * 85)
        print("ADOPTED CLANS (Groups 10-18)")
        print("=" * 85)
        print(f"{'#':<5} {'Navajo Name':<40} {'English Name':<40}")
        print("-" * 85)

        for navajo, english, group in adopted_clans:
            # For Hopi clans (Group 11), add the Hopi word
            if group == "Group 11 (Light Green)":
                hopi_word = get_hopi_word(english)
                if hopi_word:
                    display_english = f"{english} / {hopi_word}" + get_clan_type_suffix(group)
                else:
                    display_english = english + get_clan_type_suffix(group)
            else:
                display_english = english + get_clan_type_suffix(group)
            print(f"{counter:<5} {navajo:<40} {display_english:<40}")
            counter += 1

        print("-" * 85)
        print(f"Total Adopted Clans: {len(adopted_clans)}")
        print("-" * 85)

        # Add special options
        print("\n" + "=" * 85)
        print("SPECIAL OPTIONS")
        print("=" * 85)
        print(f"{'#':<5} {'Option':<40} {'Description':<40}")
        print("-" * 85)

        special_option_1 = len(clans) + 1
        option1_name = "Clan not listed"
        option1_desc = "My clan is not in this list"
        print(f"{special_option_1:<5} {option1_name:<40} {option1_desc:<40}")

        print("-" * 85)
        print(f"TOTAL: {len(clans)} clans (plus 1 special option)")
        print("-" * 85)

    def select_clans(self, user_name: str) -> List[Tuple[str, str, str]]:
        """Prompt user to select 4 clans."""
        print(f"\n{'=' * 100}")
        print(f"{user_name}, please select your 4 clans")
        print(f"{'=' * 100}")

        self.display_clans_numbered()

        # Use the reorganized displayed_clans list
        clans = self.displayed_clans
        max_option = len(clans) + 1  # Include special option
        selected_clans = []
        clan_positions = ["1st", "2nd", "3rd", "4th"]

        for position in clan_positions:
            while True:
                try:
                    choice = input(f"\nSelect your {position} clan (enter number 1-{max_option}): ").strip()
                    choice_num = int(choice)

                    if 1 <= choice_num <= len(clans):
                        # Regular clan selection
                        selected = clans[choice_num - 1]
                        navajo, english, group = selected
                        # Add clan type suffix and Hopi word for Group 11
                        if group == "Group 11 (Light Green)":
                            hopi_word = get_hopi_word(english)
                            if hopi_word:
                                display_english = f"{english} / {hopi_word}" + get_clan_type_suffix(group)
                            else:
                                display_english = english + get_clan_type_suffix(group)
                        else:
                            display_english = english + get_clan_type_suffix(group)
                        print(f"  ✓ Selected: {navajo} ({display_english})")
                        selected_clans.append(selected)
                        break
                    elif choice_num == len(clans) + 1:
                        # "Clan not listed"
                        selected = ("Clan not listed", "My clan is not in this list", "Unknown")
                        print(f"  ✓ Selected: Clan not listed")
                        selected_clans.append(selected)
                        break
                    else:
                        print(f"  ✗ Please enter a number between 1 and {max_option}")
                except ValueError:
                    print("  ✗ Please enter a valid number")
                except KeyboardInterrupt:
                    print("\n\nSelection cancelled.")
                    exit(0)

        return selected_clans


class ClanComparator:
    """Compares clans between two users."""

    def __init__(self, db: ClanDatabase):
        self.db = db

    def compare_clans(self, user1_name: str, user1_clans: List[Tuple[str, str, str]],
                     user2_name: str, user2_clans: List[Tuple[str, str, str]]):
        """Compare clans between two users and display results."""
        print(f"\n\n{'=' * 100}")
        print("CLAN COMPARISON RESULTS")
        print(f"{'=' * 100}")

        # Display selected clans
        print(f"\n{user1_name}'s Clans:")
        for i, (navajo, english, group) in enumerate(user1_clans, 1):
            if group == "Group 11 (Light Green)":
                hopi_word = get_hopi_word(english)
                if hopi_word:
                    display_english = f"{english} / {hopi_word}" + get_clan_type_suffix(group)
                else:
                    display_english = english + get_clan_type_suffix(group)
            else:
                display_english = english + get_clan_type_suffix(group)
            print(f"  {i}. {navajo} ({display_english}) - {group}")

        print(f"\n{user2_name}'s Clans:")
        for i, (navajo, english, group) in enumerate(user2_clans, 1):
            if group == "Group 11 (Light Green)":
                hopi_word = get_hopi_word(english)
                if hopi_word:
                    display_english = f"{english} / {hopi_word}" + get_clan_type_suffix(group)
                else:
                    display_english = english + get_clan_type_suffix(group)
            else:
                display_english = english + get_clan_type_suffix(group)
            print(f"  {i}. {navajo} ({display_english}) - {group}")

        # Compare each clan position
        print(f"\n{'=' * 100}")
        print("POSITION-BY-POSITION COMPARISON:")
        print(f"{'=' * 100}")

        matches_found = False
        clan_positions = ["1st", "2nd", "3rd", "4th"]

        for i in range(4):
            navajo1, english1, group1 = user1_clans[i]
            navajo2, english2, group2 = user2_clans[i]

            # Add clan type suffix and Hopi word for Group 11
            if group1 == "Group 11 (Light Green)":
                hopi_word = get_hopi_word(english1)
                if hopi_word:
                    display_english1 = f"{english1} / {hopi_word}" + get_clan_type_suffix(group1)
                else:
                    display_english1 = english1 + get_clan_type_suffix(group1)
            else:
                display_english1 = english1 + get_clan_type_suffix(group1)

            if group2 == "Group 11 (Light Green)":
                hopi_word = get_hopi_word(english2)
                if hopi_word:
                    display_english2 = f"{english2} / {hopi_word}" + get_clan_type_suffix(group2)
                else:
                    display_english2 = english2 + get_clan_type_suffix(group2)
            else:
                display_english2 = english2 + get_clan_type_suffix(group2)

            print(f"\n{clan_positions[i]} Clan Comparison:")
            print(f"  {user1_name}: {navajo1} ({display_english1}) - {group1}")
            print(f"  {user2_name}: {navajo2} ({display_english2}) - {group2}")

            # Skip comparison if either clan is unknown
            if group1 == "Unknown" or group2 == "Unknown":
                print(f"  ℹ️  Cannot compare - one or both clans unknown")
            elif navajo1 == navajo2:
                print(f"  ✅ EXACT CLAN MATCH: Both have the same clan!")
                matches_found = True
            elif group1 == group2:
                print(f"  ℹ️  GROUP MATCH: Both clans are in {group1}")
                matches_found = True
            else:
                print(f"  ✓ Different groups - No conflict")

        # Check for any shared clans or groups
        print(f"\n{'=' * 100}")
        print("OVERALL ANALYSIS:")
        print(f"{'=' * 100}")

        user1_navajo_set = {clan[0] for clan in user1_clans}
        user2_navajo_set = {clan[0] for clan in user2_clans}
        shared_clans = user1_navajo_set & user2_navajo_set

        # Filter out Unknown groups and special options from group analysis
        user1_groups = {clan[2] for clan in user1_clans if clan[2] != "Unknown"}
        user2_groups = {clan[2] for clan in user2_clans if clan[2] != "Unknown"}
        shared_groups = user1_groups & user2_groups

        # Filter out special options from exact clan matches
        shared_clans = {c for c in shared_clans if c != "Clan not listed"}

        if shared_clans:
            print(f"\n✅ EXACT CLAN MATCHES FOUND:")
            for navajo in shared_clans:
                # Find the English name
                for clan in user1_clans + user2_clans:
                    if clan[0] == navajo:
                        if clan[2] == "Group 11 (Light Green)":
                            hopi_word = get_hopi_word(clan[1])
                            if hopi_word:
                                display_english = f"{clan[1]} / {hopi_word}" + get_clan_type_suffix(clan[2])
                            else:
                                display_english = clan[1] + get_clan_type_suffix(clan[2])
                        else:
                            display_english = clan[1] + get_clan_type_suffix(clan[2])
                        print(f"    - {clan[0]} ({display_english})")
                        break

        if shared_groups:
            print(f"\nℹ️  SHARED CLAN GROUPS:")
            for group in sorted(shared_groups):
                user1_in_group = [c for c in user1_clans if c[2] == group]
                user2_in_group = [c for c in user2_clans if c[2] == group]
                print(f"\n  {group}:")
                print(f"    {user1_name}:")
                for navajo, english, grp in user1_in_group:
                    if grp == "Group 11 (Light Green)":
                        hopi_word = get_hopi_word(english)
                        if hopi_word:
                            display_english = f"{english} / {hopi_word}" + get_clan_type_suffix(grp)
                        else:
                            display_english = english + get_clan_type_suffix(grp)
                    else:
                        display_english = english + get_clan_type_suffix(grp)
                    print(f"      - {navajo} ({display_english})")
                print(f"    {user2_name}:")
                for navajo, english, grp in user2_in_group:
                    if grp == "Group 11 (Light Green)":
                        hopi_word = get_hopi_word(english)
                        if hopi_word:
                            display_english = f"{english} / {hopi_word}" + get_clan_type_suffix(grp)
                        else:
                            display_english = english + get_clan_type_suffix(grp)
                    else:
                        display_english = english + get_clan_type_suffix(grp)
                    print(f"      - {navajo} ({display_english})")

        if not shared_clans and not shared_groups:
            print("\n✓ No shared clans or clan groups found.")
            print("  The two individuals do not have clan conflicts.")

        # Check if there were any unknown clans
        unknown_count = sum(1 for clan in user1_clans + user2_clans if clan[2] == "Unknown")
        if unknown_count > 0:
            print(f"\nℹ️  Note: {unknown_count} clan(s) marked as 'Clan not listed'.")
            print("  These were not included in the comparison analysis.")

        print(f"\n{'=' * 100}")


def main():
    """Main application entry point."""
    print("=" * 100)
    print(" " * 30 + "NAVAJO CLAN RELATIONSHIP APPLICATION")
    print("=" * 100)

    # Initialize the clan database (alphabetically sorted)
    db_file = Path(__file__).parent / "clans_with_english_sorted.txt"

    if not db_file.exists():
        print("\nBuilding clan database...")
        import subprocess
        try:
            subprocess.run(["python3", str(Path(__file__).parent / "build_clan_database.py")],
                         check=True)
        except:
            print("Error: Could not build clan database!")
            return

    if not db_file.exists():
        print(f"Error: {db_file} not found!")
        return

    db = ClanDatabase(str(db_file))
    selector = ClanSelector(db)
    comparator = ClanComparator(db)

    # Get user names
    print("\nWelcome! This application compares clan relationships between two people.")
    print("Clans are displayed with proper Navajo orthography including:")
    print("  • High tones (á, é, í, ó)")
    print("  • Glottal stops (')")
    print("  • Barred L (ł)")
    print("  • Nasal vowels (ą, ę, į, ǫ)")

    user1_name = input("\nEnter the first person's name: ").strip() or "User 1"
    user2_name = input("Enter the second person's name: ").strip() or "User 2"

    # Select clans for each user
    user1_clans = selector.select_clans(user1_name)
    user2_clans = selector.select_clans(user2_name)

    # Compare the clans
    comparator.compare_clans(user1_name, user1_clans, user2_name, user2_clans)

    print("\n" + "=" * 100)
    print("Thank you for using the Navajo Clan Relationship Application!")
    print("=" * 100 + "\n")


if __name__ == "__main__":
    main()
