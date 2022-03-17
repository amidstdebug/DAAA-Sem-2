v = 5

for i in range(v):
    underscore = i + 1
    symbol = ''
    for x in range(underscore):
        symbol = symbol + '|'

    print(symbol)

for i in range(v):
    underscore = v - i - 1
    symbol = ''
    for x in range(underscore):
        symbol = symbol + '|'
    print(symbol)
    symbol = ''
