export const GAME_SCENES = {
  intro: {
    background: "party",
    speaker: "💀 Narrador",
    text: "Hoy Cerro cumple años. Sus 'amigos' organizaron una fiesta sorpresa. Lo que Cerro NO sabe es que Cartman eligió el local, Kyle eligió el catering (kosher, lo cual odia el 80% de los invitados), Stan está en su segunda botella de vodka a las 7pm, y Kenny ya murió dos veces camino a la fiesta. Una noche completamente normal.",
    emotion: "happy",
    options: [
      { text: "🚪 Entrar como el rey que soy", next: "fiesta_entrada" },
      { text: "🪟 Entrar por la ventana (modo ninja borracho)", next: "ventana" },
      { text: "🚬 Quedarme afuera fumando y cuestionando mis decisiones de vida", next: "fumar" },
    ],
  },

  fiesta_entrada: {
    background: "party",
    speaker: "🧣 Kenny (ininteligible)",
    text: "¡¡MMFPH MMFPH CUMPLEAÑMFPH!! Kenny te lanza el pastel directo a la cara. Adentro tenía una vela encendida. Tu ceja izquierda ya no existe. El médico forense que estaba de invitado dice que 'clínicamente hablando, eso duele'. Bienvenido a otro año de mierda, Cerro.",
    emotion: "shocked",
    healthChange: -15,
    options: [
      { text: "🎂 Lamer el pastel de mi cara. El dolor se come", next: "lamer_pastel" },
      { text: "👊 Romperle la nariz a Kenny (es tradición, está en el contrato)", next: "golpear_kenny" },
      { text: "🍺 Al bar. Solo el alcohol cura las quemaduras faciales", next: "bar" },
    ],
  },

  ventana: {
    background: "sky",
    speaker: "🪟 La ventana",
    text: "La ventana estaba cerrada. Con llave. Y era de doble vidrio. Tu nariz ahora tiene la forma del mapa de México. Un perro callejero con sarna te mea la pierna mientras estás tirado en el suelo. El perro tiene más dignidad que tú en este momento.",
    emotion: "shocked",
    healthChange: -25,
    options: [
      { text: "🧍 Levantarme. La dignidad es para los muertos (y Kenny)", next: "fiesta_entrada" },
      { text: "🐕 Quedarme con el perro. Al menos él no me juzga", next: "suelo" },
    ],
  },

  fumar: {
    background: "sky",
    speaker: "🍔 Cartman",
    text: "'¿Qué hacés ahí parado como un idiota reflexionando sobre tu miserable existencia, Cerro? Es tu cumpleaños, no el terapeuta.' Cartman te ofrece un cigarrillo mientras come un menú familiar para uno. 'Lo hice a base de proteínas especiales. No preguntes de dónde.' Huele raro. Muy raro.",
    emotion: "angry",
    options: [
      { text: "🚬 Aceptar el 'cigarro' de Cartman. YOLO.", next: "cigarro_especial" },
      { text: "🚪 Rechazarlo y entrar. Tengo algo de autoestima (poca)", next: "fiesta_entrada" },
      { text: "👊 Apagarlo en la cara de Cartman. Feliz cumpleaños a mí", next: "tirar_cigarro" },
    ],
  },

  suelo: {
    background: "graveyard",
    speaker: "💀 Narrador",
    text: "Cerro se quedó en el suelo con el perro. El perro se llamaba 'Fracaso', lo que en retrospectiva fue una señal. Pasaron la noche juntos bajo las estrellas. A las 3am, Cerro le confesó al perro todos sus traumas de infancia. El perro se fue. Incluso el perro callejero con sarna lo abandonó. Feliz cumpleaños.",
    emotion: "dead",
    ending: {
      type: "bad",
      title: "FINAL: ABANDONADO POR UN PERRO",
      message: "Cerro fue abandonado por un perro callejero con sarna y pulgas. El perro encontró un hogar mejor. Cerro está bien, miente.",
      subtitle: "🏆 Logro desbloqueado: 'Menos Querible que un Perro con Enfermedades'",
      emotion: "dead",
    },
  },

  lamer_pastel: {
    background: "party",
    speaker: "🥸 Kyle",
    text: "'Cerro... ese pastel lo hizo Cartman. Con sus propias manos. En el baño. Con ingredientes que no puedo mencionar por razones legales.' Tu estómago empieza a hacer ruidos que normalmente están asociados a desastres naturales. El médico forense de antes saca su teléfono y empieza a tomar fotos.",
    emotion: "shocked",
    healthChange: -20,
    drunkChange: 5,
    options: [
      { text: "🚽 Correr al baño AHORA", next: "bano" },
      { text: "🎂 Pedir más pastel. El cuerpo humano es resiliente", next: "mas_pastel" },
      { text: "🍹 Vomitar artísticamente en el ponche y nadie se dará cuenta", next: "vomitar_ponche" },
    ],
  },

  golpear_kenny: {
    background: "party",
    speaker: "🎊 Los invitados",
    text: "Le metés un uppercut a Kenny que haría llorar de orgullo a Mike Tyson. Kenny sale disparado contra la pared. '¡OH DIOS MÍO, CERRO MATÓ A KENNY!' '¡HIJO DE P...!' Cartman: 'Honestamente, ni siquiera es la primera vez hoy.'",
    emotion: "angry",
    options: [
      { text: "🕯️ Soplar la vela sobre el cadáver y pedir un deseo", next: "deseo_kenny" },
      { text: "🍺 Fingir que fue sin querer e ir al bar (no fue sin querer)", next: "bar" },
      { text: "📢 Dar un discurso de cumpleaños sobre el cadáver de Kenny", next: "discurso_cadaver" },
    ],
  },

  deseo_kenny: {
    background: "party",
    speaker: "⭐ Stan",
    text: "Cerro sopla la vela y grita su deseo: '¡DESEO QUE NUNCA MÁS TENGA RESACA!' Stan suspira: 'Viejo, primero, lo dijiste en voz alta. Segundo, Kenny ya revivió tres veces hoy solo para que tú lo mates de vuelta. Tiene más muertes que tu esperanza de vida.'",
    emotion: "happy",
    options: [
      { text: "🕺 Bailar sobre el... mejor no. Al bar.", next: "bar" },
      { text: "🎁 Abrir los regalos antes de que Cartman los 'revise'", next: "regalos" },
    ],
  },

  discurso_cadaver: {
    background: "party",
    speaker: "🎤 Cerro (inspirado)",
    text: "'Queridos seres queridos y Cartman. Hoy cumplo años, parado junto al cadáver de Kenny, mi amigo, mi hermano, mi accidente de lanzamiento de pastel. La vida es corta, como Kenny. Y cara, como la factura médica de Kenny. Así que beban porque mañana podrían ser cualquiera de nosotros. Excepto Cartman, que Dios no quiere y el diablo tampoco.' *Aplausos. Llanto. Una persona más vomita.*",
    emotion: "happy",
    options: [
      { text: "🎤 Mic drop. Al bar.", next: "bar" },
      { text: "🎁 Abrir regalos mientras Kenny sigue frío en el piso", next: "regalos" },
    ],
  },

  cigarro_especial: {
    background: "sky",
    speaker: "🌈 La Realidad (que ya no existe)",
    text: "Cerro fuma el 'cigarro especial' de Cartman. En 4 minutos: puede ver los colores con el oído. En 8 minutos: le declara amor eterno a un buzón. En 12 minutos: cree ser candidato presidencial. En 15 minutos: está llorando porque las estrellas 'se ven solas'. Cartman graba todo. Este video vale mucho dinero.",
    emotion: "drunk",
    healthChange: -15,
    drunkChange: 70,
    options: [
      { text: "📬 Abrazar al buzón. Nadie me había escuchado así", next: "abrazar_buzon" },
      { text: "🎊 Entrar a la fiesta. En este estado el mundo es hermoso", next: "fiesta_drogado" },
    ],
  },

  tirar_cigarro: {
    background: "sky",
    speaker: "🚒 Bombero",
    text: "'¡RESPETA MI AUTORITAAA!' La chaqueta de Cartman se incendia. Los bomberos llegan en 3 minutos. El bombero jefe resulta ser el padre de Cerro que lo abandonó cuando tenía 7 años. 'Hijo...' 'Papá...' 'Tengo que apagar esto.' Y se fue. No le dejó ni un número de teléfono. Solo una factura del servicio de bomberos.",
    emotion: "shocked",
    healthChange: -5,
    options: [
      { text: "💔 Pedirle que se quede aunque sea a tomar algo", next: "papa_fiesta" },
      { text: "🚪 Entrar a la fiesta. La familia solo duele si la dejas", next: "fiesta_entrada" },
    ],
  },

  papa_fiesta: {
    background: "party",
    speaker: "👨‍🚒 Papá (de paso)",
    text: "'Me quedo 10 minutos.' Se comió la mitad del pastel, se bebió 4 cervezas de Cerro, se robó un regalo (el mejor), le sacó 200 pesos 'prestados', se fue con la tía de Cerro, y mandó un mensaje a las 2am que decía solo: 'Happy Birthday'. En inglés. Después de 20 años ausente. En inglés.",
    emotion: "angry",
    healthChange: -15,
    options: [
      { text: "🍺 Ahogar esto en el bar. Profundamente.", next: "bar" },
      { text: "🎁 Abrir regalos para pensar en otra cosa", next: "regalos" },
    ],
  },

  abrazar_buzon: {
    background: "graveyard",
    speaker: "💀 Parte Médica",
    text: "Cerro pasó 3 horas hablándole al buzón sobre sus problemas de apego. A las 2am, un camión de UPS lo atropelló al intentar abrirlo 'para ver si había cartas de amor'. La ambulancia tardó 40 minutos. El paramédico dijo: 'Nunca vi a alguien tan feliz de ser atropellado por un servicio postal.' Cerro sonrió y preguntó si había paquetes.",
    emotion: "dead",
    healthChange: -100,
    ending: {
      type: "bad",
      title: "FINAL: ENTREGA EXPRESS",
      message: "Cerro fue atropellado por un camión de correos mientras intentaba abrazar un buzón. La ironía fue tan densa que hasta South Park hizo un episodio. Se llamó 'El chico que amaba el correo'.",
      subtitle: "🏆 Logro desbloqueado: 'Devuelto al Remitente'",
      emotion: "dead",
    },
  },

  fiesta_drogado: {
    background: "party",
    speaker: "👀 Stan (horrorizado)",
    text: "Cerro entra dando discursos en latín. Le declara la guerra a una planta. Le gana. Intenta darle un beso a Cartman 'por el amor universal'. Cartman lo golpea con un salami. Cerro vomita un arcoíris y dice que es 'arte'. Kyle susurra: 'Esto es lo más hermoso y perturbador que vi en mi vida.'",
    emotion: "drunk",
    healthChange: -15,
    drunkChange: 20,
    options: [
      { text: "🗡️ Partir el pastel con una katana imaginaria", next: "katana" },
      { text: "🎤 Subirse a la mesa y pronunciar mi manifiesto", next: "discurso_mesa" },
    ],
  },

  katana: {
    background: "hospital",
    speaker: "🏥 Dr. Mephesto (sí, ese)",
    text: "'Señor Cerro. Buenas noticias: dos dedos se pueden reimplantar. Malas noticias: usó un cuchillo de carnicero, no una katana, y cortó el pastel, 3 dedos y accidentalmente la corbata del médico forense que seguía de invitado. Peores noticias: el seguro médico no cubre 'yo creía que era un samurái'. Muy peores noticias: Cartman filmó todo y ya tiene 4 millones de vistas.'",
    emotion: "dead",
    healthChange: -50,
    ending: {
      type: "bad",
      title: "FINAL: EL SAMURAI DE TRES DEDOS",
      message: "Cerro perdió 3 dedos pero ganó fama viral. Tiene un canal de YouTube sobre 'vivir con menos dedos de los necesarios'. Sus suscriptores son perturbadores.",
      subtitle: "🏆 Logro desbloqueado: 'Edward Manos-Menos'",
      emotion: "dead",
    },
  },

  discurso_mesa: {
    background: "party",
    speaker: "🗣️ Cerro (filosófico, colocado)",
    text: "'¡CIUDADANOS! ¡SOY CERRO Y HOY CUMPLO AÑOS Y SOY INMORTAL COMO KENNY PERO MÁS LISTO!' La mesa cede. Cerro cae sobre el pastel. El pastel explota. Kenny muere otra vez por la onda expansiva. Butters llora. La planta que Cerro había atacado antes cae encima de Kenny. Esto será estudiado en universidades.",
    emotion: "shocked",
    healthChange: -20,
    options: [
      { text: "💪 Levantarme del pastel gritando '¡OTRA VEZ!'", next: "regalos" },
      { text: "🎂 Quedarme en el pastel. Es cómodo. Es mi cumpleaños.", next: "pastel_cama" },
    ],
  },

  pastel_cama: {
    background: "party",
    speaker: "🐱 El Gato (que nadie sabe de dónde salió)",
    text: "Cerro se durmió en los restos del pastel a las 11pm. Despertó a las 7am cubierto de betún, con un gato desconocido durmiendo en su pecho, un gorro de fiesta pegado con crema en la cara, y una servilleta que decía 'Feliz cumpleaños, idiota ❤️'. Firmado: todos. Fue el mejor cumpleaños de su vida. No lo sabe todavía.",
    emotion: "happy",
    ending: {
      type: "good",
      title: "FINAL: DULCE COMO EL PASTEL",
      message: "Cerro durmió en el pastel y despertó con un gato nuevo. El gato se llama 'Betún'. Es su mejor amigo. Betún no tiene opiniones sobre sus decisiones de vida.",
      subtitle: "🏆 Logro desbloqueado: 'La Vida Puede Ser Dulce (Si Sos La Torta)'",
      emotion: "happy",
    },
  },

  bar: {
    background: "party",
    speaker: "🧁 Butters (barman)",
    text: "Butters tiene un delantal que dice 'BÉSAME ES MI PRIMERA VEZ' en letras grandes. Temblando de emoción te muestra el menú: 'T-tengo cerveza artesanal de Colorado, tequila de importación, o... esto que encontré en el sótano de Cartman. Brilla en la oscuridad. Le pregunté a Cartman qué era y se rió durante 6 minutos sin parar. Probablemente esté bien.'",
    emotion: "happy",
    options: [
      { text: "🍺🍺🍺 Tequila. Triple doble. Deja la botella. Y la siguiente.", next: "tequila" },
      { text: "☢️ Lo que brilla. La curiosidad mató al gato pero no a Cerro. Todavía.", next: "brilla" },
      { text: "🍺 Solo una cerveza. Soy adulto responsable. (Esto es mentira.)", next: "cerveza" },
    ],
  },

  tequila: {
    background: "party",
    speaker: "🧉 Narrador (perturbado)",
    text: "Cerro se toma 9 tequilas en 12 minutos. Nuevo récord personal y probablemente violación a alguna ley física. Ahora habla en español del siglo XVII. Le dice a Kyle: 'Vos sois, con todo el respeto que me merece vuestra persona, un filisteo de baja calaña, aunque vuestra madre es una señora de virtudes cuestionables.' Kyle no sabe si llamar a un exorcista o a un historiador.",
    emotion: "drunk",
    healthChange: -20,
    drunkChange: 45,
    options: [
      { text: "🎤 Desafiar a todos a un duelo de karaoke a muerte", next: "karaoke" },
      { text: "🎁 Abrir regalos ANTES de perder el conocimiento completamente", next: "regalos" },
    ],
  },

  brilla: {
    background: "hell",
    speaker: "😈 Satanás (personalmente)",
    text: "Cerro bebió el líquido. Murió. Fue al infierno. Satanás estaba viendo Netflix. '¿Cerro? Aún no es tu hora, la app dice que te quedan 40 años. ¿Sabes lo que ES eso? Cuarenta. Años. Más. De decisiones como esta.' Satanás lo devuelve con un cupón de descuento en Pizza Hut y un mensaje: 'Descansa, lo vas a necesitar.'",
    emotion: "dead",
    healthChange: -50,
    drunkChange: 30,
    options: [
      { text: "🍕 Usar el cupón inmediatamente. El más allá al menos tiene buenas pizzas", next: "pizza" },
      { text: "🎁 Contar la experiencia cercana a la muerte como historia de cumpleaños", next: "regalos" },
    ],
  },

  cerveza: {
    background: "party",
    speaker: "💃 Narrador",
    text: "'Solo una', dijo. 14 cervezas después, Cerro está bailando cumbia con una escoba a la que llamó 'Escoberta' y a quien le contó todos sus secretos. Stan tiene $50 apostados a que no llega a medianoche. Cartman ya cobra apuestas. Butters llora porque 'el amor puede ser tan inesperado a veces'.",
    emotion: "drunk",
    healthChange: -8,
    drunkChange: 40,
    options: [
      { text: "💍 Proponerle matrimonio a Escoberta. Ella es la única", next: "matrimonio_escoba" },
      { text: "🎁 Dejar a Escoberta (por ahora) y abrir regalos", next: "regalos" },
    ],
  },

  matrimonio_escoba: {
    background: "party",
    speaker: "⛪ Cartman (sacerdote no oficial)",
    text: "Cartman oficia: 'En nombre de todo lo sagrado y mi autoridad como dos veces expulsado del seminario, los declaro escoba y esposo borracho.' Butters es la dama de honor y llora más que en su propio bar mitzvah. Kenny es el padrino o su cadáver, difícil saberlo. Stan sube el video. 3 millones de vistas. El algoritmo lo llama 'contenido familiar'.",
    emotion: "happy",
    ending: {
      type: "good",
      title: "FINAL: HASTA QUE LA RESACA NOS SEPARE",
      message: "Cerro se casó con una escoba. El video tiene 12 millones de vistas. Le ofrecieron un reality show. Escoberta pidió el divorcio alegando 'incompatibilidad de materiales'. Cerro se quedó con la custodia del recogedor y algo de dignidad (poco).",
      subtitle: "🏆 Logro desbloqueado: 'El Amor No Tiene Límites (Pero Debería)'",
      emotion: "happy",
    },
  },

  pizza: {
    background: "party",
    speaker: "🍕 Repartidor de Pizza",
    text: "La pizza llegó en 11 minutos. El repartidor vio: un cadáver (Kenny, el de siempre), a Cerro recién llegado del infierno con cara de haber visto cosas, una boda con una escoba, Cartman en calzoncillos dirigiendo una orquesta imaginaria, y al médico forense tomando fotos de todo. El repartidor dijo: 'Entrego en esta dirección hace 3 años. Esto es un martes normal.' No dejó propina. Cerro tampoco.",
    emotion: "happy",
    ending: {
      type: "good",
      title: "FINAL: DELIVERY INFERNAL",
      message: "Cerro volvió del infierno con un cupón de descuento. '¿Valió la pena morir temporalmente?' le preguntaron. 'Por una pizza Muzzarella grande con el 30% off, absolutamente sí.' Satanás le mandó una reseña de 5 estrellas en Google.",
      subtitle: "🏆 Logro desbloqueado: 'Prioridades de Ultratumba'",
      emotion: "happy",
    },
  },

  bano: {
    background: "hospital",
    speaker: "🧻 Butters (saliendo)",
    text: "El baño está ocupado. Butters sale con cara de vergüenza absoluta cargando una revista y dice: 'Lo s-siento, me tardé un poquito.' Han pasado 47 minutos. Una geóloga de los invitados dice que el sonido que emite el cuerpo de Cerro esperando 'rompe la escala de Richter en el rango más deprimente'. Cerro entra. No hablaremos de lo que encontró.",
    emotion: "shocked",
    healthChange: -5,
    options: [
      { text: "🍺 Salir como si nada. Al bar. Rápido. Sin preguntas.", next: "bar" },
      { text: "🎁 Ir directo a los regalos para cambiar de tema existencialmente", next: "regalos" },
    ],
  },

  mas_pastel: {
    background: "party",
    speaker: "🛑 Kyle (desesperado)",
    text: "'¡CERRO NO—!' Ya era tarde. Tercera rebanada. El estómago de Cerro emite un sonido que la NASA clasificó como 'fenómeno inexplicable'. Cartman: '¿Quieres saber el ingrediente secreto?' Kyle le tapa la boca. 'NO. LE. DIGAS.' El 70% del pastel ya está dentro de Cerro. Algunos misterios son más sabios sin resolver.",
    emotion: "happy",
    healthChange: -15,
    options: [
      { text: "🤔 Insistir en saber el ingrediente secreto", next: "receta" },
      { text: "🍺 Vivir en la ignorancia. Al bar.", next: "bar" },
    ],
  },

  receta: {
    background: "party",
    speaker: "😈 Cartman (encantado)",
    text: "Cartman revela la receta. No podemos reproducirla. Los abogados de Comedy Central, el Ministerio de Salud, y la OMS intervinieron. Solo diremos que involucraba: algo de Clyde, un baño en el turno tarde, y lo que Cartman llama con ternura 'el ingrediente del amor'. Cerro no volvió a comer pastel. Ni dulce. Ni nada con azúcar. En realidad no come gran cosa ya.",
    emotion: "shocked",
    healthChange: -25,
    options: [
      { text: "🍺 Al bar. A olvidar. Inmediatamente. Ahora.", next: "bar" },
      { text: "🎁 Regalos. Necesito algo positivo en mi vida.", next: "regalos" },
    ],
  },

  vomitar_ponche: {
    background: "party",
    speaker: "🤐 Narrador (cómplice)",
    text: "Nadie vio nada. Cuatro personas tomaron ponche después. Stan dijo: 'Está más rico que el año pasado, ¿le pusiste algo especial?' Cerro sonrió. El médico forense tomó una muestra 'por protocolo'. Cerro se lleva este secreto a la tumba. O al bar, que es básicamente lo mismo.",
    emotion: "happy",
    healthChange: -5,
    options: [
      { text: "🍺 Al bar (con la conciencia sucia pero el paso firme)", next: "bar" },
      { text: "🎁 Abrir regalos (y rezar por los que tomaron ponche)", next: "regalos" },
    ],
  },

  karaoke: {
    background: "party",
    speaker: "🎵 Los Vecinos (furiosos)",
    text: "Cerro elige 'My Heart Will Go On'. Lo que sale no puede clasificarse como música según ningún tratado internacional. Tres ventanas se rompen. Un vecino de 80 años sube a quejarse y termina llorando, 'pero de nostalgia', dice. El perro que había abandonado a Cerro antes vuelve, escucha 10 segundos, y se va para siempre. Cartman: 'Eso fue 10 segundos de muerte certificada.' 4.3 millones de reproducciones.",
    emotion: "drunk",
    healthChange: -5,
    drunkChange: 10,
    options: [
      { text: "🎤 ENCORE con Bohemian Rhapsody. La gente lo necesita.", next: "regalos" },
      { text: "🎤 Retirarme. Ya probé lo que quería probar.", next: "regalos" },
    ],
  },

  regalos: {
    background: "party",
    speaker: "🎁 Narrador",
    text: "Stan te da una tarjeta: 'No tuve tiempo de comprar nada así que te escribí una carta de 4 palabras: Te quiero, bro. PD: Mentí, son 5.' Kyle te da un libro: '365 días para dejar de tomar malas decisiones'. Cartman te da una caja que vibra sospechosamente. Butters preparó un cupcake que claramente cocinó con el corazón y probablemente con las manos sin lavar.",
    emotion: "happy",
    options: [
      { text: "📦 Abrir la caja de Cartman. La curiosidad es mi mayor virtud y defecto", next: "caja_cartman" },
      { text: "🎤 Dar el discurso final antes de que alguien más muera", next: "discurso_final" },
    ],
  },

  caja_cartman: {
    background: "party",
    speaker: "😈 Cartman (expectante)",
    text: "Dentro de la caja hay un hámster con un sombrerito de cumpleaños hecho a mano. Se llama 'Cerrito Jr.' Cartman: 'Lo entrené para que haga lo que vos no podés: sobrevivir más de una semana con buenas decisiones.' El hámster te mira. Con más decepción que tu primer terapeuta. Pero también con algo que parece... ¿amor? No, probablemente hambre.",
    emotion: "shocked",
    options: [
      { text: "🐹 Adoptar a Cerrito Jr. con todo mi amor roto", next: "final_bueno" },
      { text: "🎤 Dar el discurso final. El hámster puede esperar.", next: "discurso_final" },
    ],
  },

  final_bueno: {
    background: "party",
    speaker: "🌟 Narrador (emocionado)",
    text: "Cerro adoptó a Cerrito Jr. En dos semanas el hámster tiene más seguidores en Instagram que Cerro en toda su vida. Tienen un canal de YouTube juntos. El hámster hace mejores contenidos. Cartman cobra el 40% como manager. Todo tiene sentido ahora.",
    emotion: "happy",
    ending: {
      type: "good",
      title: "¡FELIZ CUMPLEAÑOS CERRO! 🎂🎉",
      message: "Cerro sobrevivió su cumpleaños, adoptó un hámster más famoso que él, y tiene una historia que contar hasta el final de sus días. Que según Cartman, sigue siendo 'pronto'.",
      subtitle: "🏆 Logro desbloqueado: 'Padre del Año (de un Roedor)'",
      emotion: "happy",
    },
  },

  discurso_final: {
    background: "party",
    speaker: "🎤 Cerro (histórico)",
    text: "'Queridos amigos... y Cartman, que es otra categoría. Gracias por esta noche de absoluta catástrofe que jamás, en toda mi vida y posiblemente en mis próximas vidas, olvidaré. Me quemaron la ceja. Probé algo de dudosa procedencia. Kenny murió cuatro veces. Vi el infierno. Me ofrecieron una escoba en matrimonio. Descubrí que mi padre es bombero. Y ninguno de ustedes me regaló algo útil. PERO... estoy vivo. Más o menos. Eso cuenta. ¡POR OTRO AÑO DE MIERDA QUE POR ALGUNA RAZÓN VALE LA PENA!'",
    emotion: "happy",
    ending: {
      type: "good",
      title: "¡FELIZ CUMPLEAÑOS, CERRO! 🎉💀🎂",
      message: "El discurso fue declarado Patrimonio Cultural Inmaterial de South Park. Cartman lo patentó igual. Cerro llegó a casa a las 5am cantando. Se despertó a las 2pm. Fue un gran cumpleaños.",
      subtitle: "🏆 Logro desbloqueado: 'El Sobreviviente Eterno'",
      emotion: "happy",
    },
  },
};