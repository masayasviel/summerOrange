// phina.js をグローバル領域に展開
phina.globalize();

// 定数
var SCREEN_WIDTH  = 640; // 画面横サイズ
var SCREEN_HEIGHT = 960; // 画面縦サイズ
var ASSETS = {
  image: {
      st:'./image/start.png',
      ed:'./image/finish.png'
  }
};

// タイトルシーン
phina.define('TitleScene', {
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    this.superInit();
    Sprite('st').addChildTo(this).setPosition(this.gridX.center(),550)
    Label({
      text:'虹',
      fontSize:64,
      fill:'#000000',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));
    Label({
      text:"TOUCH START",
      fontSize:32,
      fill:'#000000',
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(14))
      .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
    // 画面タッチ時
    this.on('pointend', function() {
      // 次のシーンへ
      this.exit();
    });
  },
});

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    this.restartButton = RestartButton().addChildTo(this).setPosition(320,800);
    var self = this;
    this.restartButton.onpointend = function() {
      self.exit();
    };
  },
});

//resultScene クラスを定義
phina.define("ResultScene", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    // 背景追加
    Sprite('ed').addChildTo(this).setPosition(this.gridX.center(),550)
    this.restartButton = RestartButton().addChildTo(this).setPosition(320,800);
    var self = this;
    this.restartButton.onpointend = function() {
      self.exit();
    };
  },
});

// RestartButtoクラスを定義
phina.define('RestartButton', {
  superClass: 'Button',
  init: function() {
    this.superInit({
      width: 300, // 横サイズ
      height: 155, // 縦サイズ
      text: 'restart',  // 表示文字
      fontSize: 70, // 文字サイズ
      fontColor: '#000000', // 文字色
      cornerRadius: 5,  // 角丸み
      fill: '#FFFFFF', // ボタン色
      stroke: '#000000',  // 枠色
      strokeWidth: 5,   // 枠太さ
    });
  },
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    assets: ASSETS,
    backgroundColor: '#2EFEF7',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});
