"""Lesson requirements, the declared gallery filters and the filtered navigation."""

import json
import re
import tempfile
import unittest
from pathlib import Path

from gramlot_examples import (available_filters, build_gallery, filter_matches, navigation_directory)
from gramlot_examples import merge_filters, read_filters

PACKAGE = Path(__file__).resolve().parents[1] / "src" / "gramlot_examples"
ENDPOINT_USE = re.compile(r"@endpoint|registerEndpoint|@upload|registerUpload|@source|registerSource|dataRpc\(|dataRemote\(|\.remote\(")
ENVIRONMENTS = [
    *((PACKAGE / "base" / f"{name}.json", PACKAGE / "base" / "pages")
      for name in ("catalog", "asqueel-catalog", "cached-trial-catalog", "selection-trial-catalog",
                   "chart-reports-catalog", "system-monitor-catalog")),
    *((PACKAGE / "trials" / name / "catalog.json", PACKAGE / "trials" / name / "pages")
      for name in ("page_store", "chat_base", "kajenn_db", "ai")),
]


class GalleryFilterTests(unittest.TestCase):
    def scratch(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        return Path(directory.name)

    def test_endpoint_use_requires_endpoint(self):
        used = 0
        for family in build_gallery(ENVIRONMENTS)["families"]:
            for example in family["examples"]:
                sources = [family["path"] / f"{example['folder']}{suffix}" for suffix in (".py", ".js")]
                if not any(ENDPOINT_USE.search(path.read_text()) for path in sources if path.is_file()):
                    continue
                used += 1
                self.assertIn("endpoint", example.get("requires", []), example["key"])
        self.assertGreater(used, 0)

    def test_declared_filters_each_match_a_lesson(self):
        gallery = build_gallery(ENVIRONMENTS)
        labels = ["All", "Plain", "Server", "Python server", "DB", "Kajenn/Asqueel", "AI (LLM)"]
        self.assertEqual([rule["label"] for rule in gallery["filters"]], labels)
        self.assertEqual([rule["label"] for rule in available_filters(gallery)], labels)
        self.assertEqual([rule["label"] for rule in available_filters(build_gallery())], ["All", "Plain", "Server"])

    def test_filter_semantics(self):
        self.assertTrue(filter_matches({"label": "All"}, ["db"]))
        self.assertTrue(filter_matches({"label": "Plain", "requires": []}, None))
        self.assertTrue(filter_matches({"label": "Plain", "requires": []}, []))
        self.assertFalse(filter_matches({"label": "Plain", "requires": []}, ["endpoint"]))
        self.assertTrue(filter_matches({"label": "DB", "any": ["db"]}, ["endpoint", "db"]))
        self.assertFalse(filter_matches({"label": "DB", "any": ["db"]}, ["endpoint"]))
        self.assertFalse(filter_matches({"label": "DB", "any": ["db"]}, None))

    def test_filters_json_shape_and_environment_filters(self):
        folder = self.scratch()
        catalog = folder / "catalog.json"
        declare = lambda value: (folder / "filters.json").write_text(json.dumps(value))
        self.assertEqual(read_filters(catalog), [])
        for bad in ({}, [{}], [{"label": ""}], [{"label": "A", "any": []}], [{"label": "A", "any": [1]}],
                    [{"label": "A", "requires": ["db"]}], [{"label": "A", "requires": [], "any": ["db"]}],
                    [{"label": "A", "extra": True}], [{"label": "A"}, {"label": "A"}]):
            declare(bad)
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                read_filters(catalog)
        declare([{"label": "Django", "any": ["django"]}])
        merged = merge_filters([PACKAGE / "catalog.json", catalog])
        self.assertEqual([rule["label"] for rule in merged],
                         ["All", "Plain", "Server", "Python server", "DB", "Kajenn/Asqueel", "Django"])
        declare([{"label": "Server", "any": ["other"]}])
        with self.assertRaisesRegex(ValueError, "Conflicting definitions"):
            merge_filters([PACKAGE / "catalog.json", catalog])

    def test_malformed_requires_is_rejected(self):
        folder = self.scratch()
        catalog = folder / "catalog.json"
        catalog.write_text(json.dumps({"environment": "test", "families": [{"key": "test_family", "folder": "f",
            "title": "T", "examples": [{"key": "test-01", "title": "T", "folder": "01_demo",
                                        "description": "d", "tags": ["t"], "requires": "db"}]}]}))
        with self.assertRaisesRegex(ValueError, "requires must be a list"):
            build_gallery([(catalog, folder)])

    def test_navigation_lists_only_the_selected_filter(self):
        labels = lambda bag: [node.label for node in bag.nodes]
        self.assertEqual(labels(navigation_directory("04-rpc/01-server_calls", (), "Server")), ["c09", "c10", "c11"])
        self.assertNotIn("c09", labels(navigation_directory("04-rpc/01-server_calls", (), "Plain")))
        self.assertEqual(labels(navigation_directory("04-rpc/01-server_calls", (), "DB")), [])
        self.assertNotIn("binding", labels(navigation_directory("data-logic-rpc", (), "Server")))
        self.assertIn("binding", labels(navigation_directory("data-logic-rpc", (), "Plain")))
        self.assertEqual(labels(navigation_directory("", (), "All")), labels(navigation_directory("")))
        self.assertEqual(navigation_directory("04-rpc/01-server_calls").get_node("c09").attr["requires"], ["endpoint"])
        with self.assertRaisesRegex(ValueError, "Unknown filter"):
            navigation_directory("", (), "Missing")

    def test_environment_lessons_are_filtered_through_their_catalogue(self):
        labels = lambda bag: [node.label for node in bag.nodes]
        self.assertEqual(labels(navigation_directory("", ENVIRONMENTS, "Kajenn/Asqueel"))[-1:], ["database-demos"])
        # Single-lesson families show their lesson in their place.
        self.assertEqual(labels(navigation_directory("database-demos", ENVIRONMENTS, "Kajenn/Asqueel")),
                         ["base-asqueel", "base-asqueel-03", "asqueel-only-01", "chart-reports"])
        # The common and the Python Real-time folders are one folder of the tree.
        self.assertEqual(labels(navigation_directory("10-realtime", ENVIRONMENTS)),
                         ["chart-reports-04", "system-monitor-02", "system-monitor-01"])
        self.assertEqual(labels(navigation_directory("10-realtime", ENVIRONMENTS, "Python server")), ["system-monitor-01"])
        self.assertEqual(labels(navigation_directory("10-realtime", ENVIRONMENTS, "Plain")), ["chart-reports-04", "system-monitor-02"])

    def test_ai_catalogue_filter_and_requirements(self):
        catalog = PACKAGE / "trials" / "ai" / "catalog.json"
        self.assertEqual(read_filters(catalog), [{"label": "AI (LLM)", "any": ["llm"]}])
        gallery = build_gallery([(catalog, PACKAGE / "trials" / "ai" / "pages")])
        self.assertEqual(available_filters(gallery)[-1], {"label": "AI (LLM)", "any": ["llm"]})
        lessons = [example for family in gallery["families"] for example in family["examples"]
                   if "llm" in example.get("requires", [])]
        self.assertEqual([example["key"] for example in lessons], ["ai-01", "ai-02"])
        for example in lessons:
            self.assertEqual(example["requires"], ["endpoint", "python", "llm"])
        labels = lambda bag: [node.label for node in bag.nodes]
        self.assertEqual(labels(navigation_directory("", ENVIRONMENTS, "AI (LLM)")), ["ai-lessons"])
        self.assertEqual(labels(navigation_directory("93-ai", ENVIRONMENTS, "AI (LLM)")), ["ai-01", "ai-02"])
        self.assertEqual(labels(navigation_directory("93-ai", ENVIRONMENTS, "Plain")), [])
        # The group "server-demos" holds only the AI family under this filter: the tree shows the family.
        self.assertEqual(labels(navigation_directory("server-demos", ENVIRONMENTS, "AI (LLM)")), ["ai-lessons"])
        # The common gallery, the one the JavaScript and serverless hosts build, has no AI lesson or filter.
        common = build_gallery()
        self.assertNotIn("AI (LLM)", [rule["label"] for rule in available_filters(common)])


if __name__ == "__main__":
    unittest.main()
