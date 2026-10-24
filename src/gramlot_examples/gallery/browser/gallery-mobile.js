/** Responsive presentation of the same shared drawers; no duplicate toolbar controls. */
export function mountGalleryMobile(renderer, root, inspector, state, onExampleVisibility = () => {}) {
    const document=renderer.destination.ownerDocument, window=document.defaultView;
    const byId=id=>document.getElementById(id);
    const shell=renderer.records.get(root).element, sidebar=byId('index-sidebar'), code=byId('index-code');
    const center=byId('gallery-center'), panel=byId('gallery-inspector-panel');
    const node=element=>renderer.elements.get(element).node;
    const set=(element,attrs)=>node(element).setAttr(attrs);
    let navigationBesideContent=false;
    let mobile=false, disposed=false, active=null, changing=false, desktopWidths, railLayout;
    state.setItem('menu',false);state.setItem('view','example');
    const releases=[];
    const listen=(element,type,handler)=>{element.addEventListener(type,handler);releases.push(()=>element.removeEventListener(type,handler));};
    const apply=()=>{
        if(!mobile||changing)return;
        changing=true;
        try {
            const view=state.getItem('view'), menu=state.getItem('menu');
            set(sidebar,{drawer:menu?true:'close'});
            set(code,{drawer:!menu&&view==='code'?true:'close'});
            set(center,{hidden:(menu&&!navigationBesideContent)||view!=='example'});
            set(shell,{data_mobile_view:view});
            set(panel,{hidden:view!=='inspector'});
            inspector.setPresentation(true,view==='inspector');
            onExampleVisibility(view==='example'&&(!menu||navigationBesideContent));
        } finally {changing=false;}
    };
    const gramlot=renderer.binding.gramlot;
    for(const [element,side] of [[sidebar,'left'],[code,'right']]) {
        const handle=gramlot.subscribe(`${node(element).getAttr('nodeId')}_closable_change`,({open})=>{
            if(!mobile||changing||node(element).getAttr('hidden'))return;
            if(side==='left') {state.setItem('menu',open);if(open)state.setItem('view','example');}
            else {state.setItem('view',open?'code':'example');if(open)state.setItem('menu',false);}
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
        const layout=`${bottom}:${narrow}`;
        if(layout!==railLayout){
            railLayout=layout;
            set(byId('gallery-frame'), {data_toolbar_position:bottom?'bottom':'left'});
            set(byId('gallery-rail-region'), {region:bottom?'bottom':'left',
                width:bottom?'100%':'42px', height:bottom?'42px':'100%',
                padding:bottom?'2px 3px':'45px 3px 3px'});
            set(byId('gallery-rail'), {orientation:bottom?'horizontal':'vertical'});
            for(const id of ['gallery-navigation-button','gallery-inspector','gallery-settings-button']) {
                set(byId(id), {width:'36px', height:'36px'});
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
            desktopWidths=[node(sidebar).getAttr('width'),node(code).getAttr('width')];
            changing=true;
            set(sidebar,{width:navigationWidth});set(code,{width:'100%'});
            changing=false;
            state.setItem('menu',false);state.setItem('view','example');apply();
        }else{
            set(shell,{data_mobile_view:null});set(center,{hidden:false});set(panel,{hidden:false});
            set(sidebar,{width:desktopWidths[0],drawer:state.getItem('navigationVisible')?true:'close'});
            set(code,{width:desktopWidths[1],drawer:state.getItem('codeVisible')?true:'close'});
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
