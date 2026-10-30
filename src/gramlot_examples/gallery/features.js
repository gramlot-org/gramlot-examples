import {Bag} from '@gramlot/gramlot';
import features from './features.json' with {type: 'json'};

/** Declare the same feature-first navigation as the Python gallery. */
export function featureIndex(pane, examples) {
    const index = pane.section({id:'gallery-features', class:'gallery-features', hidden:true});
    index.dataSetter({destination_path:'galleryIndex.featureTree', value:new Bag()});
    const links = new Bag();
    for (const [key, example] of Object.entries(examples)) {
        links.setItem(key, null, {family:example.family, url:example.url});
    }
    index.dataSetter({destination_path:'galleryIndex.featureExamples', value:links});
    index.h2('Features');
    index.p('Select a feature to find examples. Green means seen; mark Tried after experimenting.');
    index.p('^galleryIndex.featureSummary', {role:'status', class:'feature-summary'});
    index.p('^galleryIndex.featureStorageNotice', {role:'status'});
    const layout = index.div({class:'feature-layout'});
    layout.tree({storepath:'galleryIndex.featureTree', selectedPath:'^galleryIndex.featureSelection',
        labelAttribute:'caption', hideValues:true, class:'feature-tree', id:'feature-tree'});
    const details = layout.stackContainer({selectedPage:'^galleryIndex.featureSelected',
        class:'feature-details', id:'feature-details'});
    const welcome = details.contentPane({pageName:'welcome'});
    welcome.h3('Choose a feature');
    welcome.p('The branches describe capabilities, independently of the lesson order. A green branch means all its available features have been seen. Progress lasts for this browser tab’s session.');
    for (const group of features) for (const feature of group.features) {
        featureCard(details.contentPane({pageName:feature.id}), feature, examples);
    }
}

function featureCard(parent, feature, examples) {
    const card = parent.article({class:'feature-card', id:`feature-${feature.id}`});
    card.h3(feature.label);
    card.p(feature.description);
    if (feature.status !== 'Exercise') card.p(`Coverage: ${feature.status}`,  {class:'feature-evidence'});
    const available = feature.examples.filter(key => examples[key]);
    if (!available.length) {
        card.p(feature.examples.length ? 'Not available in this gallery environment' :
            feature.status === 'Quarantine' ? 'Awaiting review' : 'No dedicated example yet');
        return;
    }
    const links = card.div({class:'feature-links'});
    for (const key of available) links.button(examples[key].title,
        {node_label:key, type:'button', action:'galleryOpenFeature'});
    const control = card.select({value:`^galleryIndex.featureProgress.${feature.id}`, default:'new',
        aria_label:`${feature.title} progress`});
    for (const [value, caption] of [['new','To discover'], ['seen','Seen'], ['tried','Tried']]) {
        control.option(caption, {value});
    }
}
