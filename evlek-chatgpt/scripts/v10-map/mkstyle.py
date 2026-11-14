import json
s=json.load(open('positron.json'))
keep={'background','water','landuse_residential','park','landcover_wood','building',
 'highway_minor','highway_major_casing','highway_major_inner','highway_major_subtle','highway_motorway_casing','highway_motorway_inner','highway_motorway_subtle',
 'label_village','label_town','label_city'}
L=[]
for l in s['layers']:
    if l['id'] not in keep: continue
    p=l.setdefault('paint',{})
    i=l['id']
    if i=='background': p.clear(); p['background-color']='#14273B'
    elif i=='water': p.clear(); p['fill-color']='#081624'; p['fill-antialias']=True
    elif i=='landuse_residential': p.clear(); p['fill-color']='#1A3048'; p['fill-opacity']=0.7
    elif i in('park','landcover_wood'): p.clear(); p['fill-color']='#163029'; p['fill-opacity']=0.55
    elif i=='building': p.clear(); p['fill-color']='#203A55'; p['fill-opacity']=0.6
    elif l['type']=='line':
        p['line-color']= '#22405E' if 'minor' in i else ('#0E1F31' if 'casing' in i else '#2C4D6E')
        if 'casing' in i: p['line-opacity']=0.0
    elif l['type']=='symbol':
        lay=l.setdefault('layout',{})
        lay['text-field']=['coalesce',['get','name:tr'],['get','name:latin'],['get','name']]
        lay['text-font']=['Noto Sans Regular'] if i!='label_city' else ['Noto Sans Bold']
        lay['text-transform']='none'
        p.clear(); p['text-color']='rgba(214,226,238,0.78)'; p['text-halo-color']='rgba(8,22,36,0.85)'; p['text-halo-width']=1.4
    L.append(l)
s['layers']=L
del s['sources']['ne2_shaded']
json.dump(s,open('dark.json','w'))
print(len(L))
