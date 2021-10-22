#%%
list_students1 = ['Ann', 'Brandon', 'Christine', 'Daniel', 'Francis', 'Eileen', 'Gloria', 'Henry', 'Irene', 'John']

list_weights1 = [45,90,52,75, 48, 65, 60, 85, 49, 100]

list_heights1 = [1.54, 1.85, 1.66, 1.75, 1.58, 1.71, 1.68, 1.78, 1.62, 1.88]


#%%
list_students2 = []
list_weights2 = []
list_heights2 = []

#%%
x = 2


#%%
for i in range(x):
    list_students2.append(str(input("What is your name? ")))
    list_weights2.append(round(float(input('What is your weight? '))))
    list_heights2.append(float(input('What is your height? ')))

#%%
list_students_all = list_students1
list_weights_all = list_weights1
list_heights_all = list_heights1
for q in range(x):
    list_students_all.append(list_students2[q])
    list_weights_all.append(list_weights2[q])
    list_heights_all.append(list_heights2[q])


#%%
bmiList = []
bmi = 0
#%%

for c in range(len(list_weights_all)):
    bmi = float(list_weights_all[c]) / float(list_heights_all[c]**2)
    bmiList.append(str(list_students_all[c]) + ": " + str(f'{bmi:.2f}'))


#%%
print("\nBMI For Each Student:\n")
print(*bmiList, sep='\n')
