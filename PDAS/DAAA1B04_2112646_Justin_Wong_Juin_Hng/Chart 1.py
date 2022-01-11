import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.widgets import Button, RadioButtons, CheckButtons, Cursor

mpl.use('TkAgg')

raw_data = np.genfromtxt(
    './Datasets/(1) Price Range of HDB Flats Offered/price-range-of-hdb-flats-offered.csv',
    delimiter=',', names=True,
    dtype=[('financial_year', 'i8'), ('town', 'U20'), ('room_type', 'U8'),
           ('min_selling_price', 'i8'), ('max_selling_price', 'i8')])

# Array Declaration

financial_year = []
town = []
room_type = []
min_selling_price = []
max_selling_price = []

for row in raw_data:
    financial_year.append(row[0])
    town.append(row[1])
    room_type.append(row[2])
    min_selling_price.append(row[3])
    max_selling_price.append(row[4])

mean_selling_price = np.mean(np.array([min_selling_price, max_selling_price]),
                             axis=0)

cleaned_data = {
    'financial_year': np.array(financial_year),
    'town': np.array(town),
    'room_type': np.array(room_type),
    'min_selling_price': np.array(min_selling_price),
    'max_selling_price': np.array(max_selling_price),
    'mean_selling_price': np.array(mean_selling_price)
}

labels = ['2 Rooms', '3 Rooms', '4 Rooms', '5 Rooms']

two_room_price = []
three_room_price = []
four_room_price = []
five_room_price = []

for i in range(len(cleaned_data['room_type'])):
    if room_type[i] == '2-room':
        two_room_price.append(mean_selling_price[i])
    elif room_type[i] == '3-room':
        three_room_price.append(mean_selling_price[i])
    elif room_type[i] == '4-room':
        four_room_price.append(mean_selling_price[i])
    else:
        five_room_price.append(mean_selling_price[i])

plt.rcParams['figure.figsize'] = [30, 10]
boxplot_data = np.array(
    [two_room_price, three_room_price, four_room_price, five_room_price],
    dtype=object)
fig = plt.figure()
ax1 = fig.add_subplot(111)

room_box = ax1.boxplot(boxplot_data, labels=labels, vert=False,
                       patch_artist=True,
                       flierprops=dict(marker='+', markerfacecolor='red',
                                       markersize=10, linestyle='none'))
plt.xlabel('Price of Property in $', color='black', fontsize='20',
           labelpad=20)
plt.ylabel('Number of Rooms', color='black', fontsize='20', labelpad=20)
plt.tick_params(axis='x', colors='black', )
plt.tick_params(axis='y', colors='black')
plt.title('Boxplot of Prices vs Differing No. of Rooms', color='black',
          fontsize='30')
room_box['boxes'][0].set_facecolor('pink')
room_box['boxes'][1].set_facecolor('lightgreen')
room_box['boxes'][2].set_facecolor('lightyellow')
room_box['boxes'][3].set_facecolor('lightblue')
# Defining the cursor
cursor = Cursor(ax1, horizOn=True, vertOn=True, useblit=True,
                color='red', linewidth=1, alpha=0.5)
# Creating an annotating box
annot = ax1.annotate("", xy=(0, 0), xytext=(-40, 40),
                     textcoords="offset points",
                     bbox=dict(boxstyle='round4', fc='linen', ec='k', lw=1),
                     arrowprops=dict(arrowstyle='-|>'))
annot.set_visible(False)
# Function for storing and showing the clicked values
coord = []


def onclick(event):
    global coord
    coord.append((event.xdata, event.ydata))
    x = event.xdata
    y = event.ydata

    # printing the values of the selected point
    annot.xy = (x, y)
    text = f"${x:.2f}"
    annot.set_text(text)
    annot.set_visible(True)
    fig.canvas.draw()  # redraw the figure


fig.canvas.mpl_connect('button_press_event', onclick)
plt.grid(True)
plt.show()
