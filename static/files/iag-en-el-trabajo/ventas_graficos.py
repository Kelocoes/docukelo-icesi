import matplotlib.pyplot as plt

vendedores = ['Juan', 'Maria', 'Luis', 'Ana', 'Carlos']
ventas = [12000, 8500, 15000, 9800, 11000]

plt.bar(vendedores, ventas, color='skyblue')
plt.title('Ventas del Mes - Enero')
plt.xlabel('Vendedores')
plt.ylabel('Monto (USD)')
plt.savefig('grafico_ventas.png')
print("Gráfico generado con éxito como grafico_ventas.png")