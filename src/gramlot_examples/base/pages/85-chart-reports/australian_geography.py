"""Australian sales: select a State to explore its ABS suburb boundaries."""
from genro_bag import Bag
from gramlot import Page as BasePage, ChartPane, endpoint

class Page(BasePage):
    title='Australian sales · States and suburbs'

    def main(self,root):
        pane=root.main(max_width='1400px',margin='16px auto',padding='16px')
        pane.h1(self.title)
        pane.p('Click a State to explore its suburbs. Use Australia to return. The year, measure and grid filter remain unchanged.')
        rows=Bag()
        pane.dataSetter('sales',Bag(dict(rows=rows,title='Australia',state='',count=0,unmatched=0,boundaries=0)))
        for key,value in [('state',''),('loading',False),('error','')]:pane.dataSetter(key,value)
        bar=pane.div(display='flex',align_items='center',gap='12px',margin_bottom='8px')
        bar.button('Australia',id='geo-home',disabled='^loading',action="this.SET('state','')")
        bar.span('›',display="^state:={} ? '' : 'none'")
        bar.strong('^sales.title',id='geo-title',display="^state:={} ? '' : 'none'")
        bar.div(flex='1')
        years=bar.select(id='geo-year',value='^year',default='2025',lbl='Year',lbl_position='L',disabled='^loading',width='100px')
        for year in range(2022,2026):years.option(str(year),value=str(year))
        bar.span('Loading…',display="^loading:={} ? '' : 'none'")
        pane.div('^error',id='geo-error',role='alert')
        stats=pane.div(display='flex',flex_wrap='wrap',gap='16px',font_size='12px',margin_bottom='8px')
        stats.span('^sales.boundaries',mask='Boundaries: {}')
        stats.span('^sales.count',mask='Sales areas: {}')
        stats.span('^sales.unmatched',mask='Unmatched localities: {}',id='geo-unmatched')
        stats.span('^sales.unmatched_customers',mask='Customers outside matched areas: {}')
        pane.p('Unmatched localities remain in the table and totals; they are not assigned to a different area. Grey areas have no matched sales. Labels show values where space permits; hover for exact values and zoom to inspect dense urban areas. Chart settings also offers 3D bars on map with a configurable baseline. Search uses the same filter at both levels.',font_size='12px')
        frame=pane.frameGrid(storepath='sales.rows',rowMode='attributes',searchOn=True,height='180px')
        frame.grid.set_attr(id='geography-grid',nodeId='geographyGrid')
        columns=frame.grid.struct()
        for field,label,width,dtype in [('territory','Territory / suburb','36%','T'),('revenue','Revenue','23%','N'),('invoices','Invoices','13%','L'),('customers','Customers','13%','L'),('matched','Mapped','15%','T')]:
            columns.column(field,name=label,width=width,dtype=dtype,**({'format':'0.00'} if dtype=='N' else {}))
        config=Bag(dict(chartType='map',captionField='code',mapLabelField='territory',mapLabelMode='nameValue',mapValueField='revenue'))
        config.set_item('geoJSON',self.geojson)
        for field,label,color in [('revenue','Revenue','#5470c6'),('invoices','Invoices','#ee6666'),('customers','Customers','#3ba272'),('per_customer','Revenue per customer','#9a60b4')]:
            config.set_item(f'seriesOptions.{field}',Bag(dict(caption=label,selected=field=='revenue',color=color,axis='left')))
        ChartPane(pane,store=rows,configuration=config,storepath='sales.rows',datapath='mapChart',gridId='geographyGrid',id='geography-pane',height='620px')
        pane.p('Locality boundaries: Australian Bureau of Statistics, ASGS Edition 3, SAL 2021. Simplified for display; statistical approximations, not legal boundaries.',font_size='11px')
        pane.a('ABS boundary source',href='https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SAL/MapServer',target='_blank')
        pane.dataController("if(territory && !this.GET('state') && !this.GET('loading'))this.SET('state',territory);",territory='^mapChart.selectedTerritory')
        pane.dataRpc('load_geography',result_path='sales',state='^state',year='^year',_onBuilt=True,
                     _onCalling="this.SET('loading',true);this.SET('error','');this.SET('mapChart.selectedTerritory','')",
                     _onResult="this.SET('mapChart.geoJSON',this.GET('sales.geoJSON'));this.SET('loading',false)",
                     _onError="this.SET('loading',false);this.SET('error',error.message)")

    @endpoint
    def load_geography(self,state,year,**kwargs):
        return self.provider.read(state,year)
