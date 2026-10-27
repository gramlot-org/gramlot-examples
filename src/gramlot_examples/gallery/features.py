"""Feature-first navigation. All progress lives in the gallery's Data Bag."""
import json
from genro_bag import Bag
from pathlib import Path

FEATURES = json.loads(Path(__file__).with_name('features.json').read_text())


def feature_index(pane, examples):
    index = pane.section(id='gallery-features', class_='gallery-features', hidden=True)
    index.dataSetter('galleryIndex.featureTree', Bag())
    index.h2('Features')
    index.p('Select a feature to find examples. Green means seen; mark Tried after experimenting.')
    index.p('^galleryIndex.featureSummary', role='status', class_='feature-summary')
    index.p('^galleryIndex.featureStorageNotice', role='status')
    layout = index.div(class_='feature-layout')
    layout.tree(storepath='galleryIndex.featureTree', selectedPath='^galleryIndex.featureSelection',
                labelAttribute='caption', hideValues=True, class_='feature-tree', id='feature-tree')
    details = layout.stackContainer(selectedPage='^galleryIndex.featureSelected',
                                    class_='feature-details', id='feature-details')
    welcome = details.contentPane(pageName='welcome')
    welcome.h3('Choose a feature')
    welcome.p('The branches describe capabilities, independently of the lesson order. '
              'A green branch means all its available features have been seen. '
              'Progress lasts for this browser tab’s session.')
    for group in FEATURES:
        for feature in group['features']:
            feature_card(details.contentPane(pageName=feature['id']), feature, examples)


def feature_card(parent, feature, examples):
    card = parent.article(class_='feature-card', id='feature-' + feature['id'])
    card.h3(feature['label'])
    card.p(feature['description'])
    if feature['status'] != 'Exercise':
        card.p('Coverage: ' + feature['status'], class_='feature-evidence')
    available = [key for key in feature['examples'] if key in examples]
    if not available:
        card.p('Awaiting review' if feature['status'] == 'Quarantine' else 'No dedicated example yet')
        return
    links = card.div(class_='feature-links')
    for key in available:
        links.button(examples[key]['title'], node_label=key, type='button', action='galleryOpenFeature')
    control = card.select(value='^galleryIndex.featureProgress.' + feature['id'], default='new',
                          aria_label=feature['title'] + ' progress')
    for value, caption in (('new', 'To discover'), ('seen', 'Seen'), ('tried', 'Tried')):
        control.option(caption, value=value)
