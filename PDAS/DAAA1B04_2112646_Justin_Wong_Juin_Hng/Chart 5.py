import numpy as np
import matplotlib.pyplot as plt
from math import pi
import numpy as np
import matplotlib as mpl
from matplotlib.patches import Patch
from matplotlib.lines import Line2D


mpl.use('TkAgg')
raw_data = np.genfromtxt('./Datasets/(4) Estimated Singapore Resident Population in HDB Flats/estimated-resident-population-in-hdb-flats-by-town.csv',delimiter=',',names=True, dtype=[('financial_year','i8'),('town_or_estate','U25'),('population','i8'),('region','U20')])


financial_year = []
region = []
population = []


for row in raw_data:
    financial_year.append(row[0])
    region.append(row[3])
    population.append(row[2])


cleaned_data ={
    'year':np.array(financial_year),
    'region':np.array(region),
    'population': np.array(population)
}


unique_label = np.unique(cleaned_data['region'])
town_dict_1 = dict.fromkeys(unique_label, '')
temp_value = []
for key,value in town_dict_1.items():
    for i in range(len(population)):
        if region[i] == key:
            temp_value.append(population[i])
    town_dict_1[key] = sum(temp_value)
    temp_value = []

wedgeprops = {'width':0.3, 'edgecolor':'black', 'linewidth':2}


fig, ax = plt.subplots(figsize=(15, 15), subplot_kw=dict(aspect="equal"))
wedges, texts = ax.pie(town_dict_1.values(), wedgeprops=wedgeprops, startangle=-40)

bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
kw = dict(arrowprops=dict(arrowstyle="-"),
          bbox=bbox_props, zorder=0, va="center")

for i, p in enumerate(wedges):
    ang = (p.theta2 - p.theta1)/2. + p.theta1
    y = np.sin(np.deg2rad(ang))
    x = np.cos(np.deg2rad(ang))
    horizontalalignment = {-1: "right", 1: "left"}[int(np.sign(x))]
    connectionstyle = "angle,angleA=0,angleB={}".format(ang)
    kw["arrowprops"].update({"connectionstyle": connectionstyle})
    ax.annotate(unique_label[i], xy=(x, y), xytext=(1.35*np.sign(x), 1.4*y),
                horizontalalignment=horizontalalignment, fontsize=20,**kw)


ax.set_title("Population Distribution by Region",color='black',fontsize=30,pad=40)
plt.text(0.035, 0.05, "22%", ha='center', va='center', fontsize=42)
plt.text(0, -0.15, "Largest Population: North-East Region", ha='center',
         va='center', fontsize=15)

plt.show()

