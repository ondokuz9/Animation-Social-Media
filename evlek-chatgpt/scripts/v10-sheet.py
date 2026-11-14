import sys,glob,os
from PIL import Image, ImageDraw, ImageFont
d,out,cols,w=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
fs=sorted(glob.glob(d+'/*.png'),key=lambda f:float(os.path.basename(f)[3:-6].replace(',','.')))
h=int(w*16/9)
o=Image.new('RGB',(cols*w,((len(fs)+cols-1)//cols)*(h+30)),'#222')
dr=ImageDraw.Draw(o)
for i,f in enumerate(fs):
  im=Image.open(f).convert('RGB').resize((w,h),Image.LANCZOS)
  x=(i%cols)*w;y=(i//cols)*(h+30);o.paste(im,(x,y));dr.text((x+6,y+h+6),os.path.basename(f),fill='white')
o.save(out,quality=88)
