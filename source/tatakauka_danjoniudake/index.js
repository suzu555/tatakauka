/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core'); //一般的にモジュール化されたJavaScriptファイルを読み込むために用いられます。

//=========================================================================================================================================
//TODO: このコメント行より下の項目に注目してください。
//=========================================================================================================================================
const SKILL_NAME = "戦うか";
const GET_FACT_MESSAGE = "戦うかの言葉は";
const HELP_MESSAGE = "戦うかを聞きたい時は「戦うか」と、終わりたい時は「おしまい」と言ってください。どうしますか？";
const HELP_REPROMPT = "戦うかをどうしますか？";
const FALLBACK_MESSAGE = "それについてはわかりません。戦うかを聞きたい時は「戦うか」と、終わりたい時は「おしまい」と言ってください。どうしますか？";
const FALLBACK_REPROMPT = "戦うかをどうしますか？";
const STOP_MESSAGE = "グッバイ";

//=========================================================================================================================================
//「TODO: ここから下のデータを自分用にカスタマイズしてください。」
//=========================================================================================================================================
const data = [
    "水星の一年はたった88日です。",
    "金星は水星と比べて太陽より遠くにありますが、気温は水星よりも高いです。",
    "金星は反時計回りに自転しています。過去に起こった隕石の衝突が原因と言われています。",
    "火星上から見ると、太陽の大きさは地球から見た場合の約半分に見えます。",
    "木星の<sub alias='いちにち'>1日</sub>は全惑星の中で一番短いです。",
    "天の川銀河は約50億年後にアンドロメダ星雲と衝突します。",
    "太陽の質量は全太陽系の質量の99.86%を占めます。",
    "太陽はほぼ完璧な円形です。",
    "皆既日食は一年から二年に一度しか発生しない珍しい出来事です。",
    "土星は自身が太陽から受けるエネルギーの2.5倍のエネルギーを宇宙に放出しています。",
    "太陽の内部温度は摂氏1500万度にも達します。",
    "月は毎年3.8cm地球から離れていっています。"
];

//=========================================================================================================================================
//この行から下のコードに変更を加えると、スキルが動作しなくなるかもしれません。わかる人のみ変更を加えてください。  
//=========================================================================================================================================
function getRandomItem(arrayOfItems) { //アイテムの順番列コンテナの乱数で取り出し関数
    // can take an array, or a dictionary
    if (Array.isArray(arrayOfItems)) { //配列の場合はトルー、オブジェクトはフェールス
        // the argument is an array []
        let i = 0; //let 文はブロックスコープの局所変数を宣言します。任意で値を代入して初期化できます。
        i = Math.floor(Math.random() * arrayOfItems.length); //アイテム数を0.0-1.0を掛けて計算し整数を取り出しiに入れる
        return (arrayOfItems[i]); //アレイのアイテムのiが0からアレイアイテムの数のどれかを返す
    }

    if (typeof arrayOfItems === 'object') { //typeof 演算子はデータ型を示す文字列を返しますが、大きなひとくくりとしての型なので厳密な型判定ができないのはご存知だと思います。//｛｝書きの？オブジェクトが来た場合、ネームプロパティを読み、上の条件式を使い、メッセージを出す
        // argument is object, treat as dictionary
        const result = {}; //何か作った
        const key = this.getRandomItem(Object.keys(arrayOfItems)); //Object.keys() メソッドは、指定されたオブジェクトが持つ names プロパティの配列を、通常のループで取得するのと同じ順序で返します。そして、此の関数のランダムに送り付ける
        result[key] = arrayOfItems[key]; //resultにアレイアイテムのメッセージを入れる 
        return result; //メッセージを返す
    }
    // not an array or object, so just return the input
    return arrayOfItems; //何も無いならアレイのアイテムを入れる
}

//自作関数のメインの本題を喋る関数
const GetNewFactHandler = {
    canHandle(handlerInput) { //トルーを返すの
        const request = handlerInput.requestEnvelope.request; //ハンドラーの環境変数の束を返す、リクエストに入れる
        return request.type === 'LaunchRequest' //1を返してくれ
            || (request.type === 'IntentRequest' //1を返してくれ
                && request.intent.name === 'GetNewFactIntent'); //1を返してくれ
    },
    handle(handlerInput) { //喋る為の実行関数
        const randomFact = getRandomItem(data); //メッセージデータを変数に入れる
        const speechOutput = GET_FACT_MESSAGE + randomFact; //文字を混ぜて喋る文字を作る

        return handlerInput.responseBuilder //何かを生成、ビルダーする
            .speak(speechOutput) //喋らせる
            .withSimpleCard(SKILL_NAME, randomFact) //文字を画面に出す
            .reprompt(HELP_REPROMPT) //reprompt()では、ユーザーからの返事がなかった時の発話を指定できます。
            .getResponse(); //getResponse()で、出来上がったレスポンスを取得して、ハンドラの戻り値として使用します。
    },
};
//自作関数のメインの本題を喋る関数
const DanjonSpeakHandler = {
    canHandle(handlerInput) { //トルーを返すの
        const request = handlerInput.requestEnvelope.request; //ハンドラーの環境変数の束を返す、リクエストに入れる
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'orderIntent';
    },
    handle(handlerInput) { //喋る為の実行関数
        const speechOutput = "ダンジョンを始めよう"; //文字を混ぜて喋る文字を作る

        return handlerInput.responseBuilder //何かを生成、ビルダーする
            .speak(speechOutput) //喋らせる
            .withSimpleCard("danjon", "danjon") //文字を画面に出す
            .reprompt(HELP_REPROMPT) //reprompt()では、ユーザーからの返事がなかった時の発話を指定できます。
            .getResponse(); //getResponse()で、出来上がったレスポンスを取得して、ハンドラの戻り値として使用します。
    },
};
const HelpHandler = { //ヘルプ関数ハンドラー
    canHandle(handlerInput) { //1を返すんだ
        const request = handlerInput.requestEnvelope.request; //値の取り出し
        return request.type === 'IntentRequest' //1を出せ
            && request.intent.name === 'AMAZON.HelpIntent'; //1出すんだ
    },
    handle(handlerInput) { //喋るメイン関数
        return handlerInput.responseBuilder //戻り値を返すんだ
            .speak(HELP_MESSAGE) //ヘルプをしゃべるんだ
            .reprompt(HELP_REPROMPT) //reprompt()では、ユーザーからの返事がなかった時の発話を指定できます。
            .getResponse(); //ハンドルを返す
    },
};

const FallbackHandler = { //海外用じゃなかった？？
    // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
    //              This handler will not be triggered except in that locale, so it can be
    //              safely deployed for any locale.
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt(FALLBACK_REPROMPT)
            .getResponse();
    },
};

const ExitHandler = { //会話を止める時用
    canHandle(handlerInput) { //1を返す
        const request = handlerInput.requestEnvelope.request; //環境変数を返す束で
        return request.type === 'IntentRequest' //1を返すんだ
            && (request.intent.name === 'AMAZON.CancelIntent' //1を返すんだ
                || request.intent.name === 'AMAZON.StopIntent'); //1を返すんだ
    },
    handle(handlerInput) { //ハンドル関数
        return handlerInput.responseBuilder //ハンドルの返す関数作成
            .speak(STOP_MESSAGE) //会話を止める時のメッセージ
            .getResponse(); //ハンドルを返す
    },
};

const SessionEndedRequestHandler = { //SessionEndedRequestを受信した後は音声、カード、ディレクティブを使った応答を返すことはできませんが、クリーンアップロジックを追加するにはSessionEndedRequestハンドラーが最適な場所です
    canHandle(handlerInput) { //1を返すんだ
        const request = handlerInput.requestEnvelope.request; //寛容変数を束で返す
        return request.type === 'SessionEndedRequest'; //1を返すんだ
    },
    handle(handlerInput) { //ハンドル実行すると？？
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`); //コンソールにメッセージ表示

        return handlerInput.responseBuilder.getResponse(); //ハンドラーを返す
    },
};

const ErrorHandler = { //ASK SDK v2 for Node.jsはエラー処理が簡単で、スムーズなユーザーエクスペリエンスを実現するスキルが作成しやすくなります。エラーハンドラーは、未処理のリクエストやAPIサービスのタイムアウトなどのエラー処理ロジックを組み込むのに最適です。以下の例では、catch allエラーハンドラーをスキルに追加して、すべてのエラーに対してスキルが意味のあるメッセージを返すようにしています。
    canHandle() { //此れ受けるの無くて入れなくて良いんだ
        return true; //1を返すだけ
    },
    handle(handlerInput, error) { //ハンドルの実行処理
        console.log(`Error handled: ${error.message}`); //コンソールにエラーメッセージを入れるだけ

        return handlerInput.responseBuilder //ハンドラーのレスポンスを返す
            .speak('Sorry, an error occurred.') //喋る
            //        .reprompt('Sorry, an error occurred.') //続けて喋る
            .getResponse(); //ハンドルを返す
    },
};

const skillBuilder = Alexa.SkillBuilders.custom(); //SkillBuilderはスキルの作成、ユーザーエージェントのカスタマイズ、Lambda統合ハンドラーの作成に役立つ関数を提供します。

exports.handler = skillBuilder //まず、呼び出される側のファイルで、モジュール化する値やオブジェクトをexportsしておく。そうすることで、その値やオブジェクトに外部からアクセスすることが可能になる。
    .addRequestHandlers( //(標準処理の追加)
        GetNewFactHandler, //自作関数じゃね？
        DanjonSpeakHandler, //自作関数
        HelpHandler, //ヘルプ関数の出力
        ExitHandler, //終了関数の出力
        FallbackHandler, //最も優先順位の低いリクエストハンドラ
        SessionEndedRequestHandler //なんかね喋るらしい関数の出力
    )
    .addErrorHandlers(ErrorHandler) //エラーハンドラーの出力
    .lambda(); //これの実行か？
