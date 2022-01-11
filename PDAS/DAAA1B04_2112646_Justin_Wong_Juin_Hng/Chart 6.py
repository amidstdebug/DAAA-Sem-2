import matplotlib.pyplot as plt
from math import pi
import numpy as np
from matplotlib.patches import Patch
from matplotlib.lines import Line2D
import matplotlib.ticker as plticker
import matplotlib as mpl
mpl.use('TkAgg')


raw_data = np.genfromtxt('./Datasets/(5) HDB Property Information/hdb-property-information.csv',delimiter=',',names=True, dtype=[('max_floor_lvl','i8'),('year_completed','i8'),('residential','?'),('commercial','?'),('market_hawker','?'),('multistorey_carpark','?'),('bldg_contract_town','U20'),('total_dwelling_units','i8'),('one_room_sold','i8'),('two_room_sold','i8'),('three_room_sold','i8'),('four_room_sold','i8'),('five_room_sold','i8')])


max_floor_lvl = []
year_completed = []
residential = []
commercial = []
market_hawker = []
multistorey_carpark = []
bldg_contract_town = []
total_dwelling_units = []
one_room_sold = []
two_room_sold = []
three_room_sold = []
four_room_sold = []
five_room_sold = []


for row in raw_data:
    max_floor_lvl.append(row[0])
    year_completed.append(row[1])
    residential.append(row[2])
    commercial.append(row[3])
    market_hawker.append(row[4])
    multistorey_carpark.append(row[5])
    bldg_contract_town.append(row[6])
    total_dwelling_units.append(row[7])
    one_room_sold.append(row[8])
    two_room_sold.append(row[9])
    three_room_sold.append(row[10])
    four_room_sold.append(row[11])
    five_room_sold.append(row[12])


cleaned_data ={
    'max_floor_lvl':np.array(max_floor_lvl),
    'year_completed':np.array(year_completed),
    'residential':np.array(residential),
    'commercial':np.array(commercial),
    'market_hawker':np.array(market_hawker),
    'multistorey_carpark':np.array(multistorey_carpark),
    'bldg_contract_town':np.array(bldg_contract_town),
    'total_dwelling_units':np.array(total_dwelling_units),
    'one_room_sold':np.array(one_room_sold),
    'two_room_sold':np.array(two_room_sold),
    'three_room_sold':np.array(three_room_sold),
    'four_room_sold':np.array(four_room_sold),
    'five_room_sold':np.array(five_room_sold)
}

labels = ['2 Rooms','3 Rooms','4 Rooms','5 Rooms']

fig,ax = plt.subplots(1,2,figsize=[30,10])
ax[0].hist(max_floor_lvl)
ax[0].set_xlim(right=40)
ax[0].set_title('Histogram of Max Floor Levels of Property',fontsize=20,pad=20)
ax[1].hist(year_completed,color='indianred')
ax[1].set_title('Histogram of Year of Completion of Property',fontsize=20,pad=20)
loc = plticker.MultipleLocator(base=2) # this locator puts ticks at regular intervals
ax[0].xaxis.set_major_locator(loc)
loc = plticker.MultipleLocator(base=5) # this locator puts ticks at regular intervals
ax[1].xaxis.set_major_locator(loc)

plt.show()
