import {PreviewPage} from '../../trials/menu/theme_preview.js';

export class Page extends PreviewPage {
    static title = "Joanna appearance review";
    static profile = "Joanna";
    static density = "32px controls / 14px text";
    static css = ["/themes/gramlot-compact/theme.css", "/themes/joanna/theme.css"];
}

export class Logic {
    save(node) { node.SET('preview.notice', `Saved locally: ${node.GET('preview.name')}`); }
    reset(node) { node.SET('preview.name', 'North studio'); node.SET('preview.notice', 'Draft reset'); }
    toggleDetails(node) { node.SET('preview.details', !node.GET('preview.details')); }
    openDialog(node) { node.SET('preview.open', true); }
    openFloating(node) { node.SET('preview.floating', true); }
    closeWindow(node, message) { node.SET(message.parameters.path, false); }
}

