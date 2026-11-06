"""A host-neutral chart report using standard RPC, shared charts and one result Bag."""
from genro_bag import Bag
from gramlot import Page as BasePage, ChartPane, endpoint

class ChartReportPage(BasePage):
    report_links = [('index','Live Australian sales'), ('attributes','Attributes fixture'),
                    ('values','Values fixture')]
    row_mode = 'attributes'
    title = 'Reusable chart report'
    # The host provides provider.read(year) -> Bag and a plain GeoJSON value.

    def main(self, root):
        pane=root.main(max_width='1300px',margin='24px auto',padding='20px')
        nav=pane.nav(display='flex',gap='20px')
        for href,label in self.report_links:
            nav.a(label,href=href)
        pane.h1(self.title)
        pane.p('One server result, one grid and two independently configured charts. Reload replaces the data without rebuilding the components.')
        rows=Bag()
        pane.dataSetter('report',Bag(dict(rows=rows,period='Not loaded',count=0)))
        pane.dataSetter('reload',0)
        pane.dataSetter('loading',False)
        pane.dataSetter('error','')
        bar=pane.div(display='flex',align_items='center',gap='12px',margin_bottom='12px')
        year=bar.select(value='^year',default='2025',lbl='Year',lbl_position='L',id='report-year',disabled='^loading')
        for value,label in [('2025','2025'),('2024','2024'),('2023','2023'),('2030','2030 — empty result'),('2022','2022 — unavailable comparison')]:
            year.option(label,value=value)
        bar.button('Reload from server',id='reload-report',disabled='^loading',action="this.SET('reload',this.GET('reload')+1)")
        bar.span('^report.period',id='loaded-period')
        bar.span('^report.count',mask='Territories: {}',id='loaded-count')
        bar.span('Loading…',display='^loading:={} ? "inline" : "none"',role='status')
        pane.div('^error',id='report-error',role='alert',color='var(--gramlot-danger,#bd3344)')
        frame=pane.frameGrid(storepath='report.rows',rowMode=self.row_mode,searchOn=True,height='240px')
        frame.grid.set_attr(id='report-grid',nodeId='reportGrid')
        cols=frame.grid.struct()
        for field,label,width,dtype in [('territory','Territory','28%','T'),('code','Code','8%','T'),('revenue','Billed','20%','N'),('customers','Customers','12%','L'),('per_customer','Per customer','18%','N'),('change_pct','Annual change %','14%','N')]:
            cols.column(field,name=label,width=width,dtype=dtype,**({'format':'0.00'} if dtype=='N' else {}))
        chart_row=pane.div(display='grid',grid_template_columns='repeat(auto-fit,minmax(420px,1fr))',gap='16px',margin_top='18px')
        for key,kind,measure in [('map','map','per_customer'),('bars','bar','revenue')]:
            box=chart_row.section(min_width=0)
            box.h2('Territory comparison' if key=='map' else 'Selected values',font_size='18px')
            config=Bag(dict(chartType=kind,captionField='territory' if key=='map' else 'code',mapValueField=measure,mapLabelField='code'))
            config.set_item('geoJSON',self.geojson)
            for field,label,color in [('revenue','Billed total','#5470c6'),('customers','Distinct customers','#3ba272'),('per_customer','Billed per customer','#9a60b4'),('change_pct','Annual change (%)','#ee6666')]:
                config.set_item(f'seriesOptions.{field}',Bag(dict(caption=label,selected=field==measure,color=color,axis='left')))
            chart=ChartPane(box,store=rows,configuration=config,storepath='report.rows',datapath=f'{key}.config',rowMode=self.row_mode,gridId='reportGrid',id=f'{key}-pane',height='420px')
        pane.p('Filtering the grid filters both charts. An empty result preserves configuration; a failed request preserves the last successful result. The displayed period always belongs to the loaded data.')
        pane.dataRpc('load_report',result_path='report',year='=year',reload='^reload',_onBuilt=True,
                     _onCalling="this.SET('loading',true);this.SET('error','')",
                     _onResult="this.SET('loading',false)",
                     _onError="this.SET('loading',false);this.SET('error',error.message)")

    @endpoint
    def load_report(self,year,**kwargs):
        return self.provider.read(year)


class FixtureChartReport:
    """Deterministic transport fixture with the same contract as the live provider."""
    def __init__(self,row_mode):self.row_mode=row_mode

    def read(self,year):
        if year not in ('2022','2023','2024','2025','2030'):raise ValueError('Unknown fixture year')
        if year=='2022':raise ValueError('Previous-year comparison unavailable; previous data retained')
        rows=Bag()
        if year!='2030':
            for i,(name,code) in enumerate([('Alpha','A'),('Beta','B')]):
                revenue=(int(year)-2020)*(i+1)*100
                record=dict(territory=name,code=code,revenue=revenue,customers=10+i,per_customer=revenue/(10+i),change_pct=(-1 if i else 1)*5)
                if year=='2023':
                    record.pop('per_customer')
                    record['units']=(i+1)*25
                rows.set_item(f'r{i}',Bag(record) if self.row_mode=='values' else None,**(record if self.row_mode=='attributes' else {}))
        return Bag(dict(rows=rows,period=f'{year} vs {int(year)-1}',count=len(rows)))


def fixture_geography():
    return dict(type='FeatureCollection',features=[dict(type='Feature',properties=dict(name=name),
        geometry=dict(type='Polygon',coordinates=[[[i,0],[i+.9,0],[i+.9,1],[i,1],[i,0]]])) for i,name in enumerate(('Alpha','Beta'))])
