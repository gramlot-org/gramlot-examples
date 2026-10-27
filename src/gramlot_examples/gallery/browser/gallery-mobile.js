/** Responsive presentation of the same shared drawers; no duplicate toolbar controls. */
export function mountGalleryMobile(renderer, root, inspector, state, onExampleVisibility = () => {}) {
    const document=renderer.destination.ownerDocument, window=document.defaultView;
    const byId=id=>document.getElementById(id);
    const shell=renderer.records.get(root).element, sidebar=byId('index-sidebar');
    const center=byId('gallery-center'), panel=byId('gallery-inspector-panel');
    const node=element=>renderer.elements.get(element).node;
    const set=(element,attrs)=>node(element).setAttr(attrs);
    let navigationBesideContent=false;
    let mobile=false, disposed=false, active=null, changing=false, desktopWidth, railLayout;
    state.setItem('menu',false);state.setItem('view','example');
    const releases=[];
    const listen=(element,type,handler)=>{element.addEventListener(type,handler);releases.push(()=>element.removeEventListener(type,handler));};
    const apply=()=>{
        if(!mobile||changing)return;
        changing=true;
        try {
            const view=state.getItem('view'), menu=state.getItem('menu');
            set(sidebar,{drawer:menu?true:'close'});
            set(center,{hidden:(menu&&!navigationBesideContent)||view!=='example'});
            set(shell,{data_mobile_view:view});
            set(panel,{hidden:view!=='inspector'});
            inspector.setPresentation(true,view==='inspector');
            onExampleVisibility(view==='example'&&(!menu||navigationBesideContent));
        } finally {changing=false;}
    };
    const gramlot=renderer.binding.gramlot;
    for(const element of [sidebar]) {
        const handle=gramlot.subscribe(`${node(element).getAttr('nodeId')}_closable_change`,({open})=>{
            if(!mobile||changing||node(element).getAttr('hidden'))return;
            state.setItem('menu',open);if(open)state.setItem('view','example');
            apply();
        });
        releases.push(()=>gramlot.unsubscribe(handle));
    }
    listen(byId('gallery-inspector'),'click',()=>{
        if(!mobile)return;
        state.setItem('menu',false);
        state.setItem('view',state.getItem('view')==='inspector'?'example':'inspector');apply();
    });
    listen(sidebar,'click',event=>{
        if(mobile&&event.composedPath().some(element=>element.classList?.contains('leaf')&&element.getAttribute('role')==='treeitem')) {
            state.setItem('menu',false);apply();
        }
    });
    listen(window,'keydown',event=>{
        if(mobile&&event.key==='Escape'){state.setItem('menu',false);state.setItem('view','example');apply();}
    });
    const resize=()=>{
        const narrow=window.getComputedStyle(shell).getPropertyValue('--gallery-narrow').trim()==='1';
        const position=state.getItem('toolbarPosition');
        if(!['auto','left','bottom'].includes(position))throw new TypeError('Unknown gallery toolbar position');
        const bottom=position==='bottom'||position==='auto'&&narrow&&window.innerHeight>=window.innerWidth;
        const thickness='var(--gallery-toolbar-size,42px)';
        const control='var(--gallery-control-size,36px)';
        const layout=`${bottom}:${narrow}:${thickness}:${control}`;
        if(layout!==railLayout){
            railLayout=layout;
            set(byId('gallery-frame'), {data_toolbar_position:bottom?'bottom':'left'});
            set(byId('gallery-rail-region'), {region:bottom?'bottom':'left',
                width:bottom?'100%':thickness, height:bottom?thickness:'100%',
                padding:bottom?'2px 3px':`calc(${thickness} + 3px) 3px 3px`});
            set(byId('gallery-rail'), {orientation:bottom?'horizontal':'vertical'});
            for(const id of ['gallery-navigation-button','gallery-inspector','gallery-settings-button']) {
                set(byId(id), {width:control, height:control});
            }
        }
        // Keep a useful content column beside navigation whenever the viewport allows it.
        // Toolbar orientation is independent of the width needed by the navigation tree.
        navigationBesideContent=window.innerWidth-(bottom?0:42)>=260+360;
        const navigationWidth=navigationBesideContent?'260px':'100%';
        if(narrow===mobile){
            if(mobile){set(sidebar,{width:navigationWidth});apply();}
            return;
        }
        mobile=narrow;
        if(mobile){
            desktopWidth=node(sidebar).getAttr('width');
            changing=true;
            set(sidebar,{width:navigationWidth});
            changing=false;
            state.setItem('menu',false);state.setItem('view','example');apply();
        }else{
            set(shell,{data_mobile_view:null});set(center,{hidden:false});set(panel,{hidden:false});
            set(sidebar,{width:desktopWidth,drawer:state.getItem('navigationVisible')?true:'close'});
            inspector.setPresentation(false,false);
        }
    };
    state.subscribe('gallery-toolbar-position', {any:event=>{
        if(event.node.label==='toolbarPosition')resize();
    }});
    releases.push(()=>state.unsubscribe('gallery-toolbar-position', {any:true}));
    listen(window,'resize',resize);resize();
    const update=(entries,next)=>{
        if(active!==next){state.setItem('menu',false);state.setItem('view','example');}
        active=next;apply();
    };
    const dispose=()=>{if(disposed)return;disposed=true;for(const release of releases)release();};
    renderer.onDispose(root,dispose);
    return {update,dispose};
}
