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
        nested = children.get_node("06-nested")
        assert nested.value is None
        assert nested.attr["url"] == "pages/00-html_svg/06-nested/00-index"
        assert children.get_node("01-html_basics").attr["directory"] == "00-html_svg/01-html_basics"
        assert navigation_directory("00-html_svg/01-html_basics").get_node("e01").attr["url"] == "pages/00-html_svg/01-html_basics/01-hello_world"
        assert children.get_node("00-index") is None
        leaves = navigation_directory("00-html_svg/06-nested")
        assert [node.label for node in leaves.nodes] == ["01-child"]
        assert leaves.get_node("01-child").attr["url"] == "pages/00-html_svg/06-nested/01-child"
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
                assert node.attr["title"] == page_title(gallery["routes"][example["key"]]["page"])
                assert node.attr["title"] == example["title"]
                assert node.attr["url"] == f"pages/{family['folder']}/{example['folder']}"
                assert node.label not in seen
                seen.add(node.label)
                if len(parts) > 1:
                    parent = navigation_directory(family["folder"]).get_node(parts[0])
                    assert parent.value is None
                    assert parent.attr["url"] in gallery["routes"]
                for suffix in (".py", ".js", ".md"):
                    assert gallery["assets"][f"/pages/{family['folder']}/{example['folder']}{suffix}"]["file"].is_file()
        assert len(seen) == sum(len(family["examples"]) for family in gallery["families"])


    def test_numbered_siblings_and_markdown_index(self):
        assert [n.label for n in navigation_directory().nodes] == ["html_svg", "components", "binding", "controllers", "rpc", "layout", "grid", "menus", "editors", "tools", "composition", "grouplets"]
        branch = navigation_directory("00-html_svg")
        assert [n.label for n in branch.nodes] == ["01-html_basics", "02-native_controls", "03-svg", "04-page_composition", "06-nested", "07-markdown_index"]
        md = branch.get_node("07-markdown_index")
        assert md.attr["title"] == "Descriptive directory index"
        assert md.attr["url"] == "pages/00-html_svg/07-markdown_index/00-index"
        assert md.attr["markdown"].startswith("# Descriptive directory index")
        assert len(navigation_directory(md.attr["directory"])) == 0


def test_environment_overlay_keeps_common_and_host_subdirectories_within_their_roots(tmp_path):
    import json
    folder = tmp_path / "07-tools"
    folder.mkdir()
    (folder / "00-index.md").write_text("# Tools and IDE\n")
    host = folder / "03-host"
    host.mkdir()
    (host / "00-index.md").write_text("# Host tools\n")
    (host / "01-sample.py").write_text('from gramlot import Page as BasePage\nclass Page(BasePage):\n    title = "Host sample"\n')
    catalog = tmp_path / "catalog.json"
    catalog.write_text(json.dumps({"environment": "test", "families": [{
        "key": "host_tools", "title": "Tools and IDE", "folder": "07-tools", "examples": []}]}))
    catalogs = [(catalog, tmp_path)]
    tools = navigation_directory("07-tools", catalogs)
    assert tools.get_node("02-advanced") is not None
    assert tools.get_node("03-host") is not None
    assert len(navigation_directory("07-tools/02-advanced", catalogs)) > 0
    assert navigation_directory("07-tools/03-host", catalogs).get_node("01-sample").attr["title"] == "Host sample"
    outside = tmp_path / "outside"
    outside.mkdir()
    (folder / "escape").symlink_to(outside, target_is_directory=True)
    assert navigation_directory("07-tools", catalogs).get_node("escape") is None
    import pytest
    with pytest.raises(ValueError, match="outside its pages root"):
        navigation_directory("07-tools/escape", catalogs)
    with pytest.raises(ValueError, match="does not exist"):
        navigation_directory("07-tools/absent", catalogs)
