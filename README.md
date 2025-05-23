## 🎯 Objetivo

Acercar la astronomía a un público amplio mediante una experiencia visual guiada. El sistema apunta un láser hacia las estrellas que componen cada constelación, ayudando a reconocerlas mientras proporciona información sobre su posición y significado cultural.

## 🧠 ¿Cómo funciona?

- Un **panel interactivo** permite al usuario seleccionar una constelación del Zodiaco.
- Un **Arduino** controla un servomotores y un steper que mueven el puntero láser.
- El sistema apunta con precisión a las estrellas principales de la constelación seleccionada.

## 🛠️ Tecnologías utilizadas

- Arduino UNO (o similar)
- 2 servomotores (para movimiento en dos ejes)
- Puntero láser (de baja potencia, seguro para uso controlado)
- Proyector o pantalla
- Control remoto
- Código en JS y Arduino
- Impresora 3D

## 🔌 Requisitos

- Arduino IDE instalado
- Librería `Servo.h` para controlar los motores
- Fuente de alimentación adecuada
- Precaución al usar el láser (no apuntar a los ojos)

## 📦 Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/Thomastudy/panelistas.git
   cd panelistas
