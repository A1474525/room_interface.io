let device;
let characteristic;
let isConnected = false;

document.getElementById('connectBtn').addEventListener('click', async () => {
  try {
    // Запрос на подключение к Bluetooth устройству
    device = await navigator.bluetooth.requestDevice({
      filters: [{ name: 'ESP32_Device' }],
      optionalServices: ['12345678-1234-1234-1234-123456789012']
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789012');
    characteristic = await service.getCharacteristic('87654321-4321-4321-4321-210987654321');

    console.log('Connected to device');
    isConnected = true;
    document.getElementById('controlBtn').disabled = false;

  } catch (error) {
    console.log('Error:', error);
  }
});

document.getElementById('controlBtn').addEventListener('click', async () => {
  if (!characteristic) {
    console.log('Not connected to device');
    return;
  }

  // Переключаем состояние между true и false
  const command = isConnected ? "true" : "false";
  const encoder = new TextEncoder();
  const value = encoder.encode(command);
  await characteristic.writeValue(value);

  console.log('Command sent:', command);
  isConnected = !isConnected; // Смена состояния
});