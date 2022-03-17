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
label = np.unique(cleaned_data['town'])
town_dict_1 = dict.fromkeys(label, 0)
temp_price = []
for key, value in town_dict_1.items():
    for i in range(len(town)):
        if town[i] == key:
            temp_price.append(min_selling_price[i])
    town_dict_1[key] = temp_price
    temp_price = []
for key, value in town_dict_1.items():
    town_dict_1[key] = round(np.average(np.array(value)), 2)

label = np.unique(cleaned_data['town'])
town_dict_2 = dict.fromkeys(label, 0)
temp_price = []
for key, value in town_dict_2.items():
    for i in range(len(town)):
        if town[i] == key:
            temp_price.append(max_selling_price[i])
    town_dict_2[key] = temp_price
    temp_price = []
for key, value in town_dict_2.items():
    town_dict_2[key] = round(np.average(np.array(value)), 2)

label = np.unique(cleaned_data['town'])
town_dict_3 = dict.fromkeys(label, 0)
temp_price = []
for key, value in town_dict_3.items():
    for i in range(len(town)):
        if town[i] == key:
            temp_price.append(mean_selling_price[i])
    town_dict_3[key] = temp_price
    temp_price = []
for key, value in town_dict_3.items():
    town_dict_3[key] = round(np.average(np.array(value)), 2)

# %%

fig = plt.figure()
ax1 = fig.add_subplot(111)

labels = list(town_dict_1.keys())
pos = np.arange(len(labels))
bar_width = 0.25

plt.xticks(pos, labels)
plt.rcParams['figure.figsize'] = [30, 10]
plt.tick_params(axis='x', colors='black', )
plt.tick_params(axis='y', colors='black')
plt.yticks([0, 50000, 100000, 150000, 200000, 250000, 300000, 350000])
plt.title('Bar Graph of Avg Property Prices vs Estates', color='black',
          fontsize='30')
rax = plt.axes([0, 0.025, 0.1, 0.1])
labels = ['Min Selling Price', 'Max Selling Price', 'Mean Selling Price']
visibility = [False, False, False]
plot_button = CheckButtons(rax, labels, visibility)


# function for displaying/hiding the plots
def select_plot(label):
    # get the index that corresponds to the word "label"
    index = labels.index(label)

    # set the plot to visible
    if index == 0:
        ax1.bar(pos - bar_width, list(town_dict_1.values()), bar_width,
                align='center', color='skyblue')
        fig.canvas.draw()
    elif index == 1:
        plt.yticks([0, 50000, 100000, 150000, 200000, 250000, 300000, 350000])
        ax1.bar(pos, list(town_dict_2.values()), bar_width,
                align='center',
                color='lightcoral')
        fig.canvas.draw()
    elif index == 2:
        plt.yticks([0, 50000, 100000, 150000, 200000, 250000, 300000, 350000])
        ax1.bar(pos + bar_width, list(town_dict_3.values()), bar_width,
                align='center')
        fig.canvas.draw()


plot_button.on_clicked(select_plot)
# Defining the cursor
cursor = Cursor(ax1, horizOn=True, vertOn=True, useblit=True,
                color='red', linewidth=1,alpha=0.5)
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
    text = f"${y:.2f}"
    annot.set_text(text)
    annot.set_visible(True)
    fig.canvas.draw()  # redraw the figure


fig.canvas.mpl_connect('button_press_event', onclick)

plt.show()
