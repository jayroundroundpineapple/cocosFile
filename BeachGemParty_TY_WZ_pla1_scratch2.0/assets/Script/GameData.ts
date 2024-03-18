
/**
 * 游戏数据
 */
export default class GameData {

  /**本地化配置 */
  public static languageConfig: languageData;
  public static languageIndex: number;


  /**总配置
   * 0默认
   * 1日语（Japanese） 
     2德语 (German) 
     3语法（French） 
     4俄语 (Russian) 
     5西班牙语 (Spanish)  
     6意大利语（Italian） 
     7乌克兰语(Ukrainian) 
     8葡萄牙语 (Portuguese) 
     9印度尼西亚语 (Indonesian) 
     10印地语(Hindi) 
     11越南语(Vietnamese) 
     12泰语(Thai) 
     13马来语 (Malay) 
     14罗马尼亚语 (Romanian) 
     15菲律宾语（Tagalog） 
     16韩语（Korean） 
   */
  private static config = {
    "0": { Youwon: "You WON", Cashout: "Cash out", CONGRATULATIONS: "CONGRATULATIONS", moneyCount: 100, unit: "$", hintString: "Practice Game Only", cardStr: "PLEASE TURN OVER ONE OF THE CARDS", sceonds: "CONGRATULATIONS! YOU HAVE OBTAINED THE MONEY, PLEASE CLICK TO GET IT", Youwon2: "<color=#ffffff>You won a welcome\nbonus of </c><color=#fd1e1e>==</color>", YOURB: "YOUR BALANCE", SWITCH: "SWITCH", Nothing: "Nothing" },
    "1": { Youwon: "勝ったコイン", Cashout: "現金を引き出す", CONGRATULATIONS: "おめでとう", moneyCount: 10000, unit: "￥", hintString: "練習ゲームのみ", cardStr: "カードをひっくり返してください ", sceonds: "おめでとう、ご賞金をクリックして受け取ってください", Youwon2: "<color=#fd1e1e>==</color>ドルの賞金\n<color=#ffffff>を獲得しました</c>", YOURB: "あなたのバランス", SWITCH: "スイッチ", Nothing: "何もない" },
    "2": { Youwon: "Du hast gewonnen", Cashout: "Auszahlen", CONGRATULATIONS: "HERZLICHE GLÜCKWÜNSCHE", moneyCount: 100, unit: "€", hintString: "Nur Übungsspiel", cardStr: "Bitte drehen Sie eine der Karten um", sceonds: "HERZLICHE GLÜCKWÜNSCHE! SIE HABEN DAS GELD ERHALTEN, BITTE KLICKEN SIE, UM ES ZU ERHALTEN", Youwon2: "<color=#ffffff>Sie haben einen Bonus\nvon </c><color=#fd1e1e>€200  gewonnen</color>", YOURB: "DEIN KONTOSTAND", SWITCH: "SCHALTER", Nothing: "何もない" },
    "3": { Youwon: "TU AS GAGNÉ", Cashout: "Encaisser", CONGRATULATIONS: "TOUTES NOS FÉLICITATIONS", moneyCount: 100, unit: "€", hintString: "Jeu d'entraînement uniquement", cardStr: "VEUILLEZ RENVOYER UNE DES CARTES", sceonds: "TOUTES NOS FÉLICITATIONS! VOUS AVEZ OBTENU L'ARGENT, VEUILLEZ CLIQUER POUR L'OBTENIR", YOURB: "VOTRE SOLDE", SWITCH: "CHANGER", Nothing: "Rien" },
    "4": { Youwon: "Tы выиграл", Cashout: "Oбналичить", CONGRATULATIONS: "ПОЗДРАВЛЯЕМ", moneyCount: 10000, unit: "₽", hintString: "Только тренировочная игра", cardStr: "ПОЖАЛУЙСТА, ПЕРЕВЕРНИТЕ ОДНУ ИЗ КАРТ", sceonds: "ПОЗДРАВЛЯЕМ! ВЫ ПОЛУЧИЛИ ДЕНЬГИ, НАЖМИТЕ, ЧТОБЫ ПОЛУЧИТЬ", YOURB: "ВАШ БАЛАНС", SWITCH: "ВЫКЛЮЧАТЕЛЬ", Nothing: "Ничего такого" },
    "5": { Youwon: "Ganaste", Cashout: "Cobrar", CONGRATULATIONS: "FELICIDADES", moneyCount: 100, unit: "€", hintString: "Juego de práctica solamente", cardStr: "POR FAVOR ENVIE UNA DE LAS TARJETAS", sceonds: "¡FELICIDADES! HA OBTENIDO EL DINERO, HAGA CLIC PARA OBTENERLO", Youwon2: "Ganaste un bono de <color=#fd1e1e>€200</color>", YOURB: "TU BALANCE", SWITCH: "CAMBIAR", Nothing: "Nada" },
    "6": { Youwon: "Hai vinto", Cashout: "Incassare", CONGRATULATIONS: "CONGRATULAZIONI", moneyCount: 100, unit: "€", hintString: "Solo gioco di pratica", cardStr: "SI PREGA DI GIRARE UNA DELLE CARTE", sceonds: "CONGRATULAZIONI! HAI OTTENUTO I SOLDI, FARE CLIC PER OTTENERLO", Youwon2: "Hai vinto un bonus di <color=#fd1e1e>€200</color>", YOURB: "IL TUO BILANCIO", SWITCH: "INTERRUTTORE", Nothing: "Niente" },
    "7": { Youwon: "Ти виграв", Cashout: "Перевести в готівку", CONGRATULATIONS: "ВІТАЄМО", moneyCount: 3000, unit: "₴", hintString: "Тренуйтеся лише в грі", cardStr: "Будь ласка, переверніть одну з карток", sceonds: "ВІТАЄМО! ВИ ОТРИМАЛИ ГРОШІ, БУДЬ ЛАСКА, КЛАЦНІТЬ, ЩОБ ОТРИМАТИ", Youwon2: "Ви виграли бонус у \nрозмірі <color=#fd1e1e>₴6000</color>доларів", YOURB: "ВАШ ВАЛАНС", SWITCH: "ПЕРЕКЛЮЧАТИ", Nothing: "Нічого" },
    "8": { Youwon: "Você ganhou", Cashout: "Sacar", CONGRATULATIONS: "PARABÉNS", moneyCount: 500, unit: "R$", hintString: "Jogo de treino apenas", cardStr: "POR FAVOR, DEIXE UM DOS CARTÕES", sceonds: "PARABÉNS! VOCÊ OBTEVE O DINHEIRO, CLIQUE PARA OBTER", Youwon2: "Você ganhou um bônus\nde<color=#fd1e1e>R$1000</c>", YOURB: "SEU BALANÇO", SWITCH: "INTERRUPTOR", Nothing: "Nada" },
    "9": { Youwon: "Anda menang", Cashout: "Kas keluar", CONGRATULATIONS: "SELAMAT", moneyCount: 1000000, unit: "Rp", hintString: "Latihan Game Saja", cardStr: "HARAP KEMBALIKAN SALAH SATU KARTU", sceonds: "SELAMAT! ANDA TELAH MEMPEROLEH UANG, SILAHKAN KLIK UNTUK MENDAPATKANNYA", Youwon2: "Anda memenangkan bonus\n<color=#fd1e1e>Rp1500000</c>", YOURB: "BALANSI Anda", SWITCH: "BERALIH", Nothing: "Tidak ada" },
    "10": { Youwon: "आप जीते", Cashout: "नकदी निकलना", CONGRATULATIONS: "बहुत बहुत बधाई", moneyCount: 10000, unit: "₹", hintString: "केवल खेल का अभ्यास करें", cardStr: "कृपया कार्डों में से एक को टर्न करें", sceonds: "आप बधाई के पात्र हैं! आपने पैसा प्राप्त कर लिया है, कृपया इसे प्राप्त करने के लिए क्लिक करें", Youwon2: "आपने<color=#fd1e1e>₹16000</c>का बोनस जीता", YOURB: "आपका बैलेंस", SWITCH: "स्विच", Nothing: "कुछ भी तो नहीं" },
    "11": { Youwon: "Bạn đã thắng", Cashout: "Rút tiền", CONGRATULATIONS: "XIN CHÚC MỪNG", moneyCount: 2000000, unit: "₫", hintString: "Chỉ trò chơi thực hành", cardStr: "Bạn đã thắng", sceonds: "XIN CHÚC MỪNG! BẠN ĐÃ KIẾM ĐƯỢC TIỀN, HÃY BẤM VÀO ĐỂ NHẬN ĐƯỢC", Youwon2: "Bạn đã giành được khoản tiền\nthưởng <color=#fd1e1e>₫4000000</c> đô la", YOURB: "SỐ CÂN CỦA BẠN", SWITCH: "CÔNG TẮC ĐIỆN", Nothing: "Không có gì" },
    "12": { Youwon: "คุณได้รับรางวัล", Cashout: "เงินออก", CONGRATULATIONS: "ขอแสดงความยินดี", moneyCount: 3000, unit: "฿", hintString: "ฝึกฝนเกมเท่านั้น", cardStr: "VUI LÒNG BỎ QUA MỘT TRONG CÁC THẺ", sceonds: "ขอแสดงความยินดี! คุณได้รับเงินแล้วโปรดคลิกเพื่อรับมัน", Youwon2: "คุณได้รับโบนัส <color=#fd1e1e>฿6000</c>", YOURB: "ยอดคงเหลือของคุณ", SWITCH: "สวิตซ์", Nothing: "ไม่มีอะไร" },
    "13": { Youwon: "Kamu telah menang", Cashout: "Keluarkan duit", CONGRATULATIONS: "TAHNIAH", moneyCount: 500, unit: "RM", hintString: "Amalkan Permainan Sahaja", cardStr: "SILA HIDUPKAN SALAH SATU KAD", sceonds: "TAHNIAH! ANDA TELAH MENDAPAT WANG, SILA KLIK UNTUK MENDAPATKANNYA", Youwon2: "Anda memenangi\nbonus <color=#fd1e1e>RM800</c>", YOURB: "BAKI ANDA", SWITCH: "TUKAR", Nothing: "Tidak ada" },
    "14": { Youwon: "Ai castigat", Cashout: "Încasa", CONGRATULATIONS: "FELICITĂRI ", moneyCount: 500, unit: "L", hintString: "Practică doar jocul", cardStr: "Vă rugăm să întoarceți unul dintre carduri", sceonds: "FELICITĂRI! AȚI OBȚINUT BANI, VĂ RUGĂM CLICK PENTRU A O OBȚINE", Youwon2: "Ai câștigat un bonus\nde <color=#fd1e1e>L1000</c>", YOURB: "ECHILIBRUL TAU", SWITCH: "INTRERUPATOR", Nothing: "Nimic" },
    "15": { Youwon: "Nanalo ka", Cashout: "Mag-cash out", CONGRATULATIONS: "CONGRATULATIONS", moneyCount: 5000, unit: "₱", hintString: "Laro sa Pagsasanay Lamang", cardStr: "MANGYARING PALIHIN ANG ISA SA Kard", sceonds: "CONGRATULATIONS! NAKUHA MO ANG PERA, Paki-click upang makuha ito", Youwon2: "Nanalo ka ng bonus\n na <color=#fd1e1e>₱10000</c>", YOURB: "IYONG BALANSE", SWITCH: "SWITCH", Nothing: "Wala" },
    "16": { Youwon: "당신이 이겼습니다", Cashout: "현금 인출", CONGRATULATIONS: "축하합니다", moneyCount: 100000, unit: "₩", hintString: " 연습 게임 만", cardStr: "카드 중 하나를 뒤집으십시오", sceonds: "축하합니다! 당신은 돈을 얻었습니다, 그것을 얻으려면 클릭하십시오", Youwon2: "<color=#fd1e1e>₩200000</c> 의 \n보너스를 받았습니다.", YOURB: "당신의 균형", SWITCH: "스위치", Nothing: "아무것도" },
  }






  /**系统语言初始化 */
  public static languageInit() {
    let languageIndex: number = 0;
    let language: string = cc.sys.language;
    if (language.indexOf("ja") >= 0) {//日语（Japanese） 
      languageIndex = 1;
    } else if (language.indexOf("de") >= 0) {//德语 (German)  
      languageIndex = 2;
    } else if (language.indexOf("fr") >= 0) {//法语（French）  
      languageIndex = 3;
    } else if (language.indexOf("ru") >= 0) {//俄语 (Russian)  
      languageIndex = 4;
    } else if (language.indexOf("es") >= 0) {//西班牙语 (Spanish)   
      languageIndex = 5;
    } else if (language.indexOf("it") >= 0) {//意大利语（Italian） 
      languageIndex = 6;
    } else if (language.indexOf("uk") >= 0) {//乌克兰语(Ukrainian)  
      languageIndex = 7;
    } else if (language.indexOf("pt") >= 0) {//葡萄牙语 (Portuguese) 
      languageIndex = 8;
    } else if (language.indexOf("id") >= 0) {//印度尼西亚语 (Indonesian)  in id
      languageIndex = 9;
    } else if (language.indexOf("hi") >= 0) {//印地语(Hindi) 
      languageIndex = 10;
    } else if (language.indexOf("vi") >= 0) {//越南语(Vietnamese)
      languageIndex = 11;
    } else if (language.indexOf("th") >= 0) {//泰语(Thai)
      languageIndex = 12;
    } else if (language.indexOf("ms") >= 0) {//马来语 (Malay)
      languageIndex = 13;
    } else if (language.indexOf("ro") >= 0) {//罗马尼亚语 (Romanian) 
      languageIndex = 14;
    } else if (language.indexOf("ce") >= 0) {//菲律宾语（Tagalog）
      languageIndex = 15;
    } else if (language.indexOf("ko") >= 0) {//韩语（Korean）
      languageIndex = 16;
    } else {
      languageIndex = 0;
    }

    GameData.languageIndex = languageIndex;
    GameData.languageConfig = GameData.config[languageIndex];
  }
}


export interface languageData {
  Youwon: string,
  Cashout: string,
  CONGRATULATIONS: string,
  moneyCount: number,
  unit: string,
  /**平台提示语 */
  hintString: string,
  cardStr: string,
  sceonds: string,
  Youwon2: string,
  YOURB: string;
  Nothing: string;
  SWITCH: string;
}
