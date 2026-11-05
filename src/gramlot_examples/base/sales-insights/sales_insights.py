"""Read-only sales snapshot, composed exclusively with shared Gramlot controls."""
from genro_bag import Bag
from gramlot import ChartPane


def territory_measures(dataset, year):
    """Derive the chosen year's ratios from independently aggregated years."""
    annual={(row['year'],row['territory']):row for row in dataset['state_year']}
    result=[]
    for (row_year,name),current in annual.items():
        if row_year!=year:continue
        previous=annual.get((year-1,name))
        if previous is None or previous['revenue']==0 or current['customers']<=0:
            raise ValueError('Map comparison requires a nonzero previous year and a positive distinct-customer count')
        result.append(dict(territory=name,billed_millions=round(current['revenue']/1e6,3),
                           customers=current['customers'],billed_per_customer=round(current['revenue']/current['customers'],2),
                           annual_change_pct=round((current['revenue']/previous['revenue']-1)*100,2)))
    return result


def sales_insights(root, dataset, geojson):
    """Compose aggregated invoice data supplied by the hosting environment."""
    summary = dataset['summary']
    page = root.main(max_width='1440px', margin='0 auto', padding='28px 32px',
                     font_family='system-ui, sans-serif')
    page.div('AUSTRALIA / SALES EXPLORER', color='#84b8ff', font_size='12px',
             font_weight=700, letter_spacing='2px')
    page.h1('Four years. One business view.', margin='8px 0', font_size='34px')
    page.p('2022–2025 · All invoice rows · Read-only database snapshot',
           margin='0 0 24px', color='var(--gramlot-text-secondary)')
    cards = page.div(display='grid', grid_template_columns='repeat(auto-fit,minmax(190px,1fr))', gap='14px')
    for title, value, note in [
        ('Billed total', f"{summary['total']/1e9:,.3f} B", 'Stored invoice amounts'),
        ('Invoices', f"{summary['invoices']:,}", f"{dataset['rows']:,} invoice rows"),
        ('Active customers', f"{summary['customers']:,}", 'Customers with invoices'),
        ('Average invoice', f"{summary['total']/summary['invoices']:,.0f}", 'Billed total / invoice count')]:
        card=cards.div(padding='18px 20px',background='var(--gramlot-surface-subtle)',
                       border='1px solid var(--gramlot-border)',border_radius='10px')
        card.div(title,font_size='12px',color='var(--gramlot-text-secondary)')
        card.div(value,font_size='30px',font_weight=700,margin='5px 0',color='var(--gramlot-ink)')
        card.div(note,font_size='11px',color='var(--gramlot-text-secondary)')

    def section(parent,title,subtitle):
        box=parent.section(min_width='0',margin_top='24px')
        box.h2(title,font_size='20px',margin='0 0 6px')
        box.p(subtitle,font_size='12px',margin='0 0 10px',color='var(--gramlot-text-secondary)')
        return box

    def store(records):
        bag=Bag()
        for i,record in enumerate(records):bag.set_item(f'r{i}',None,**record)
        return bag

    def chart(parent,key,records,kind,category,measure,color='#5470c6',height='350px',**options):
        rows=store(records)
        conf=Bag(dict(chartType=kind,captionField=category,aggregation='none',**options))
        numeric={k for record in records for k,v in record.items() if isinstance(v,(int,float))}
        for field in numeric:
            conf.set_item(f'seriesOptions.{field}',Bag(dict(selected=field==measure,color=color,axis='left')))
        if kind in ('map','map3D'):conf.set_item('geoJSON',geojson)
        if kind=='map':
            for field,caption in [('billed_millions','Billed 2025 (millions)'),('customers','Distinct customers 2025'),('billed_per_customer','Billed per customer 2025'),('annual_change_pct','Change 2025 vs 2024 (%)')]:
                conf.set_item(f'seriesOptions.{field}.caption',caption)
        pane=ChartPane(parent,store=rows,configuration=conf,storepath=f'{key}.rows',
                       datapath=f'{key}.config',id=f'{key}-pane',height=height)
        pane.chart.set_attr(id=f'{key}-chart')
        return pane

    monthly=[dict(month=x['month'],billed_millions=round(x['revenue']/1e6,3),invoices=x['invoices']) for x in dataset['monthly']]
    chart(section(page,'The monthly rhythm','48 months · Billed amounts in millions. Use the gear to explore other measures and chart types.'),
          'monthly',monthly,'line','month','billed_millions','#4f73dd',height='350px')
    pair=page.div(display='grid',grid_template_columns='repeat(auto-fit,minmax(450px,1fr))',gap='24px')
    states=[dict(territory=x['territory'],billed_millions=round(x['revenue']/1e6,3),
                 invoices_thousands=round(x['invoices']/1000,3),customers=x['customers']) for x in dataset['states']]
    # Short state codes make the standard chart axis readable; full names remain in the store.
    codes={'Northern Territory':'NT','Tasmania':'TAS','South Australia':'SA','Victoria':'VIC',
           'New South Wales':'NSW','Western Australia':'WA','Queensland':'QLD','Australian Capital Territory':'ACT'}
    map_records=[dict(record,state=codes[record['territory']]) for record in territory_measures(dataset,2025)]
    map_pane=chart(section(pair,'Australia: a closer comparison','2025 · Colour compares states. Choose billed total, billed per distinct customer, or change versus 2024 from the gear.'),
          'australia',map_records,'map','territory','billed_per_customer',height='410px',mapValueField='billed_per_customer',mapLabelField='state')
    state_bars=[dict(x,state=codes[x['territory']]) for x in states]
    chart(section(pair,'Where the revenue comes from','All eight states and territories · Billed amounts in millions.'),
          'states',state_bars,'bar','state','billed_millions','#5470c6',height='410px')
    product_records=[dict(code=x['code'],product=x['product'],billed_millions=round(x['revenue']/1e6,3),units=x['units']) for x in dataset['products']]
    product_section=section(page,'Products that lead','Top 10 by billed line amount across the complete dataset · Codes on the chart; descriptions in the table.')
    chart(product_section,'products',product_records,'bar','code','billed_millions','#9a60b4',height='340px')
    frame=product_section.frameGrid(storepath='products.rows',rowMode='attributes',searchOn=True,height='225px')
    columns=frame.grid.struct()
    for field,label,width,dtype in [('code','Product','13%','T'),('product','Description','57%','T'),('billed_millions','Billed (millions)','15%','N'),('units','Units','15%','L')]:
        columns.column(field,name=label,width=width,dtype=dtype)
    year_section=section(page,'An extra dimension','State × year · Billed amounts in millions. Search the table for a year or state to filter the shared 3D chart.')
    yearly=[dict(year=str(x['year']),state=codes[x['territory']],billed_millions=round(x['revenue']/1e6,3),invoices_thousands=round(x['invoices']/1000,3)) for x in dataset['state_year']]
    year_rows=store(yearly)
    year_section.dataSetter('yearly.rows',year_rows)
    frame=year_section.frameGrid(storepath='yearly.rows',rowMode='attributes',searchOn=True,height='200px')
    frame.grid.set_attr(nodeId='yearlyGrid',id='yearly-grid')
    columns=frame.grid.struct()
    for field,label in [('year','Year'),('state','State'),('billed_millions','Billed (millions)'),('invoices_thousands','Invoices (thousands)')]:
        columns.column(field,name=label,width='25%')
    conf=Bag(dict(chartType='bar3D',captionField='state',secondCaptionField='year',aggregation='sum'))
    conf.set_item('seriesOptions.billed_millions',Bag(dict(selected=True,color='#5470c6',axis='left')))
    conf.set_item('seriesOptions.invoices_thousands',Bag(dict(selected=False,color='#3ba272',axis='right')))
    pane=ChartPane(year_section,store=year_rows,configuration=conf,storepath='yearly.rows',datapath='yearly.config',gridId='yearlyGrid',id='yearly-pane',height='460px')
    pane.chart.set_attr(id='yearly-chart')
    page.p('Snapshot from the full database. Invoice totals reconcile with invoice-line totals, monthly totals and state totals. Product ranking uses line amounts. Natural Earth boundaries · Public domain.',
           font_size='11px',color='var(--gramlot-text-secondary)',margin_top='24px')
