from gramlot_examples import navigation_directory, build_gallery, page_title
import unittest


class NavigationDirectoryTests(unittest.TestCase):
    def test_directory_navigation_is_lazy_and_has_own_index_urls(self):
        root = navigation_directory()
        html = root.get_node("html_svg")
        assert html.value is None
        assert html.attr["directory"] == "00-html_svg"
        assert html.attr["url"] == "pages/00-html_svg/00-index"
        children = navigation_directory("00-html_svg")
        assert children.get_node("06-nested") is None
        assert children.get_node("01-html_basics").attr["directory"] == "00-html_svg/01-html_basics"
        assert navigation_directory("00-html_svg/01-html_basics").get_node("e01").attr["url"] == "pages/00-html_svg/01-html_basics/01-hello_world"
        assert children.get_node("00-index") is None
        leaves = navigation_directory("00-html_svg/06-nested")
        assert not leaves.nodes
        for suffix in (".json", ".md"):
            assert f"/pages/00-html_svg/06-nested/01-child{suffix}" in build_gallery()["assets"]
        routes = build_gallery()["routes"]
        for url in ("pages/00-index", "pages/00-html_svg/00-index", "pages/00-html_svg/06-nested/00-index", "pages/00-html_svg/06-nested/01-child"):
            assert url in routes


    def test_directory_navigation_rejects_traversal(self):
        for path in ["../", "/tmp", "html_svg/../../", "html_svg//nested"]:
            with self.subTest(path=path), self.assertRaisesRegex(ValueError, "Invalid navigation directory"):
                navigation_directory(path)


    def test_border_lessons_are_nested_with_own_page_and_original_routes(self):
        containers = navigation_directory("05-containers")
        branch = containers.get_node("01-border")
        assert branch.value is None
        assert branch.attr["directory"] == "05-containers/01-border"
        assert branch.attr["url"] == "pages/05-containers/01-border/00-index"
        assert containers.get_node("l01") is None
        assert containers.get_node("l07").attr["url"] == build_gallery()["routes"]["l07"]["url"]
        lessons = navigation_directory("05-containers/01-border")
        assert [node.label for node in lessons.nodes] == [f"l0{i}" for i in range(1, 7)]
        gallery = build_gallery()
        assert "pages/05-containers/01-border/00-index" in gallery["routes"]
        for node in lessons.nodes:
            assert node.attr["url"] == gallery["routes"][node.label]["url"]
            route = gallery["routes"][node.label]
            assert route["page"].parent.name == "01-border"
            assert route["logic"].is_file()
            for suffix in (".py", ".js", ".md"):
                url = f"/pages/05-containers/01-border/{route['page'].stem}{suffix}"
                assert gallery["assets"][url]["file"].is_file()


    def test_every_catalogue_lesson_is_reachable_in_its_topic_group(self):
        gallery = build_gallery()
        seen = set()
        for family in gallery["families"]:
            for example in family["examples"]:
                parts = example["folder"].split("/")
                directory = "/".join([family["folder"], *parts[:-1]])
                branch = navigation_directory(directory)
                node = branch.get_node(example["key"])
                assert node.attr["title"] == example["title"]
                assert node.attr["url"] == f"pages/{family['folder']}/{example['folder']}"
                assert node.label not in seen
                seen.add(node.label)
                if len(parts) > 1:
                    level = navigation_directory("/".join([family["folder"], *parts[:-2]]))
                    parent = level.get_node(parts[-2])
                    if parent is None:  # A folder with one lesson shows the lesson in its place.
                        assert len(branch) == 1
                        assert level.get_node(example["key"]).attr["url"] == node.attr["url"]
                    else:
                        assert parent.value is None
                        assert parent.attr["url"] in gallery["routes"]
                for suffix in (".py", ".js", ".md"):
                    assert gallery["assets"][f"/pages/{family['folder']}/{example['folder']}{suffix}"]["file"].is_file()
        assert len(seen) == sum(len(family["examples"]) for family in gallery["families"])


    def test_numbered_siblings_and_markdown_index(self):
        assert [n.label for n in navigation_directory().nodes] == ["html_svg", "fields-inputs", "data-logic-rpc", "layout-menus", "grid", "charts", "editors-tools", "composition-reuse", "realtime"]
        assert [n.label for n in navigation_directory("data-logic-rpc").nodes] == ["binding", "controllers", "rpc"]
        branch = navigation_directory("00-html_svg")
        # 02-native_controls and 03-svg hold one lesson each: the tree shows the lesson, not a folder around it.
        assert [n.label for n in branch.nodes] == ["01-html_basics", "e06", "e08"]
        assert branch.get_node("07-markdown_index") is None


def test_environment_overlay_keeps_common_and_host_subdirectories_within_their_roots(tmp_path):
    import json
    folder = tmp_path / "01-inputs"
    folder.mkdir()
    (folder / "00-index.md").write_text("# Inputs and host\n")
    host = folder / "03-host"
    host.mkdir()
    (host / "00-index.md").write_text("# Host tools\n")
    (host / "01-sample.py").write_text('from gramlot import Page as BasePage\nclass Page(BasePage):\n    title = "Host sample"\n')
    (host / "02-other.py").write_text('from gramlot import Page as BasePage\nclass Page(BasePage):\n    title = "Other host sample"\n')
    catalog = tmp_path / "catalog.json"
    catalog.write_text(json.dumps({"environment": "test", "families": [{
        "key": "host_inputs", "title": "Inputs and host", "folder": "01-inputs", "examples": []}]}))
    catalogs = [(catalog, tmp_path)]
    tools = navigation_directory("01-inputs", catalogs)
    assert tools.get_node("02-checks_and_switches") is not None
    assert tools.get_node("03-host") is not None
    assert len(navigation_directory("01-inputs/02-checks_and_switches", catalogs)) > 0
    assert navigation_directory("01-inputs/03-host", catalogs).get_node("01-sample").attr["title"] == "Host sample"
    outside = tmp_path / "outside"
    outside.mkdir()
    (folder / "escape").symlink_to(outside, target_is_directory=True)
    assert navigation_directory("01-inputs", catalogs).get_node("escape") is None
    import pytest
    with pytest.raises(ValueError, match="outside its pages root"):
        navigation_directory("01-inputs/escape", catalogs)
    with pytest.raises(ValueError, match="does not exist"):
        navigation_directory("01-inputs/absent", catalogs)


def test_first_lesson_uses_generated_metadata():
    gallery = build_gallery()
    example = next(item for item in gallery["families"][0]["examples"] if item["key"] == "e01")
    assert navigation_directory("00-html_svg/01-html_basics").get_node("e01").attr["title"] == example["title"]
    assert example["tags"] == ["html", "heading", "text", "source"]
    assert "/pages/00-html_svg/01-html_basics/01-hello_world.json" in gallery["assets"]


def test_search_metadata_in_navigation():
    lessons = navigation_directory("01-inputs/02-checks_and_switches")
    field = lessons.get_node("w16").attr
    hierarchy = lessons.get_node("checkbox-tree").attr
    assert field["title"] == "checkBoxText"
    assert field["component"] == "checkBoxText"
    assert "descriptions" in field["tags"]
    assert "stored codes" in field["description"]
    assert hierarchy["title"] == "Hierarchical choices"
    assert "checkbox" in hierarchy["tags"]


def test_chart_index_metadata_titles():
    assert navigation_directory().get_node("charts").attr["title"] == "Charts"


def test_no_folder_holds_a_single_entry(tmp_path):
    """At every level, after environment and filter, a directory with one entry is replaced by that entry."""
    import json
    folder = tmp_path / "95-single"
    (folder / "01-topic").mkdir(parents=True)
    (folder / "00-index.md").write_text("# Single\n")
    (folder / "01-topic" / "00-index.md").write_text("# Topic\n")
    page = 'from gramlot import Page as BasePage\nclass Page(BasePage):\n    title = "{}"\n'
    (folder / "01-topic" / "01-only.py").write_text(page.format("Only lesson"))
    catalog = tmp_path / "catalog.json"
    catalog.write_text(json.dumps({"environment": "single", "families": [{
        "key": "single_family", "title": "Single", "folder": "95-single", "group": "database-demos", "examples": [
            {"key": "single-01", "title": "Only lesson", "folder": "01-topic/01-only", "description": "d", "tags": ["t"]}]}]}))
    catalogs = [(catalog, tmp_path)]
    # Family -> topic folder -> one lesson: the lesson replaces both folders inside its group.
    group = navigation_directory("database-demos", catalogs)
    assert [node.label for node in group.nodes] == ["single-01"]
    assert group.get_node("single-01").attr["url"] == "pages/95-single/01-topic/01-only"
    # The group itself holds one entry: the root shows the lesson in its place.
    root = navigation_directory("", catalogs)
    assert root.get_node("database-demos") is None
    assert root.get_node("single-01").attr["title"] == "Only lesson"
    # A filter that leaves one family in a group shows that family at the root.
    assert "single-01" in [node.label for node in navigation_directory("", catalogs, "Plain").nodes]



def test_uncatalogued_pages_are_not_in_the_tree(tmp_path):
    """A page whose metadata says ``catalogued: false`` keeps its route but is not listed."""
    import json
    folder = tmp_path / "95-hidden"
    folder.mkdir()
    (folder / "00-index.md").write_text("# Hidden\n")
    page = 'from gramlot import Page as BasePage\nclass Page(BasePage):\n    title = "{}"\n'
    for stem, title in (("01-first", "First lesson"), ("02-second", "Second lesson"), ("03-support", "Support page")):
        (folder / f"{stem}.py").write_text(page.format(title))
    (folder / "03-support.json").write_text(json.dumps({"key": "support", "title": "Support page", "catalogued": False}))
    catalog = tmp_path / "catalog.json"
    catalog.write_text(json.dumps({"environment": "hidden", "families": [{
        "key": "hidden_family", "title": "Hidden", "folder": "95-hidden", "examples": [
            {"key": f"hidden-0{n}", "title": title, "folder": stem, "description": "d", "tags": ["t"]}
            for n, (stem, title) in enumerate((("01-first", "First lesson"), ("02-second", "Second lesson")), 1)]}]}))
    catalogs = [(catalog, tmp_path)]
    assert [node.label for node in navigation_directory("95-hidden", catalogs).nodes] == ["hidden-01", "hidden-02"]
    assert "pages/95-hidden/03-support" in build_gallery(catalogs)["routes"]


def test_trial_support_pages_are_not_in_the_tree():
    from pathlib import Path
    import gramlot_examples
    trials = Path(gramlot_examples.__file__).parent / "trials"
    for name, folder, hidden in (("page_store", "90-page_store", "04_nested_branch"), ("kajenn_db", "91-kajenn_db", "03_nested")):
        catalogs = [(trials / name / "catalog.json", trials / name / "pages")]
        urls = [node.attr["url"] for node in navigation_directory(folder, catalogs).nodes]
        assert urls and f"pages/{folder}/{hidden}" not in urls
