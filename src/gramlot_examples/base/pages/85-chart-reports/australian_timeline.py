"""Real Australian invoice snapshots supplied by the read-only host provider."""
from genro_bag import Bag
from gramlot import Page as BasePage, ChartPane, endpoint

class Page(BasePage):
    title='Australian sales · temporal snapshots'

    def main(self,root):
        pane=root.main(max_width='1400px',margin='20px auto',padding='16px')
        pane.h1(self.title)
        pane.p('Complete read-only invoice data, prepared by period and territory on the server. Search the grid to filter the chart. Revenue and invoice count use separate fixed axes.')
        rows=Bag()
        pane.dataSetter('sales',Bag(dict(rows=rows,count=0,source_lines=0,source_invoices=0)))
        pane.dataSetter('reload',0)
        pane.dataSetter('loading',False);pane.dataSetter('error','')
        bar=pane.div(display='flex',align_items='center',gap='12px')
        control=bar.select(id='sales-grain',value='^grain',default='month',lbl='Prepared data',lbl_position='L',disabled='^loading',width='200px',flex_shrink='0')
        control.option('Monthly totals',value='month');control.option('Daily totals',value='day')
        bar.button('Reload data',id='sales-reload',disabled='^loading',white_space='nowrap',action="this.SET('reload',this.GET('reload')+1)")
        bar.span('Loading…',display='^loading:={} ? "inline" : "none"')
        pane.div('^error',id='sales-error',role='alert')
        counts=pane.div(display='flex',gap='16px',margin='10px 0')
        for key,label in [('source_lines','Invoice lines: {}'),('source_invoices','Invoices: {}'),('count','Chart store rows: {}')]:
            counts.span(f'^sales.{key}',mask=label,id=f'sales-{key}')
        frame=pane.frameGrid(storepath='sales.rows',rowMode='attributes',searchOn=True,height='230px')
        frame.grid.set_attr(id='sales-grid',nodeId='salesGrid')
        columns=frame.grid.struct()
        for field,label,width,dtype in [('period','Period','14%','D'),('territory','Territory','26%','T'),('revenue','Billed total','18%','N'),('invoices','Invoices','12%','L'),('units','Units','16%','L'),('customers','Customers per period','14%','L')]:
            columns.column(field,name=label,width=width,dtype=dtype)
        config=Bag(dict(chartType='bar',captionField='code',timeField='period',timeStep='month',timeSpeed=0.5))
        for field,color,axis,selected in [('revenue','#5470c6','left',True),('invoices','#ee6666','right',True),('units','#3ba272','right',False),('customers','#9a60b4','right',False),('rank','#73c0de','left',False),('invoice_lines','#fac858','right',False)]:
            config.set_item(f'seriesOptions.{field}',Bag(dict(selected=selected,color=color,axis=axis)))
        ChartPane(pane,store=rows,configuration=config,storepath='sales.rows',datapath='salesChart',gridId='salesGrid',id='sales-pane',height='520px')
        pane.p('Daily/monthly selects server-prepared totals. Temporal Period only selects snapshots; it never aggregates them. For uPlot choose Lines and Rank as the category field. Customer counts are distinct within each period and territory, not additive across periods.')
        pane.dataRpc('load_sales',result_path='sales',grain='^grain',reload='^reload',_onBuilt=True,
                     _onCalling="this.SET('loading',true);this.SET('error','')",
                     _onResult="this.SET('salesChart.timeStep',this.GET('sales.grain'));this.SET('loading',false)",
                     _onError="this.SET('loading',false);this.SET('error',error.message)")

    @endpoint
    def load_sales(self,grain,**kwargs):
        return self.provider.read_timeline(grain)
