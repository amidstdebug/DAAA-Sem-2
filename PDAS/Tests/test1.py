#%%

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import matplotlib.font_manager


#%%

params = {"ytick.color" : "w",
          "xtick.color" : "w",
          "axes.labelcolor" : "w",
          "axes.edgecolor" : "w"}
plt.rcParams.update(params)

#%% md

# Basic Graphs

#%%

x = [1,2,3,4,5,6]
y = [1,4,9,16,25,36]
plt.plot(x,y, label='x^2', color='purple', linewidth='5')

plt.xlabel('Amount of weed')

plt.ylabel('Time')

plt.legend()

plt.xticks([1,2,3,4,5,6])

plt.title('Our first graph',
     color = 'white',
     fontdict={
        'fontname':'Arial',
         'fontsize': '20'
})

plt.show()