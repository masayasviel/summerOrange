// phina.js をグローバル領域に展開
phina.globalize();

// 定数
var SCREEN_WIDTH  = 640; // 画面横サイズ
var SCREEN_HEIGHT = 960; // 画面縦サイズ
var score; // スコア
var turnPoint;
// var finishPoint = 10;
var speed = -15;
var ASSETS = {
  image: {
      st:'./image/start.png',
      torokko:'./image/torokko.png',
      tree:'./image/tree.png',
      orange:'./image/orange.png',
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
    // 初期値にリセット
    score = 0;
    turnPoint = 0;
    // score表示
    this.label_score = Label({
      text: '',
      fontSize: 54,
      fill: '#000000',
    }).addChildTo(this).setPosition(this.gridX.center(),this.gridY.center());
    // プレイヤー作成
    this.player = Player().addChildTo(this).setPosition(SCREEN_WIDTH / 2,SCREEN_HEIGHT / 2);
    // orangeグループ
    this.orangeGroup = DisplayElement().addChildTo(this);
    // treeグループ
    this.treeGroup = DisplayElement().addChildTo(this);
    //thisの退避
    var self = this;
    this.tweener
      .wait(300)
      .call(function(){
        if(turnPoint % 2 == 0){
          Tree().addChildTo(self.treeGroup);
        }else{
          Orange().addChildTo(self.orangeGroup);
        }
        turnPoint++;
      })
      .setLoop(true)
      .play();
  },
  // OrangeとPlayerの当たり判定処理
  hitTestOrangePlayer: function() {
    var player = this.player;
    var self = this;
    // 敵をループ
    this.orangeGroup.children.each(function(orange) {
      // 判定用の円
      var c1 = Circle(orange.x,orange.y,30);
      var c2 = Circle(player.x,player.y,50); 
      // 円判定
      if(Collision.testCircleCircle(c1,c2)){
        orange.remove();
        score++;
      }
    });
  },
  // TreeとPlayerの当たり判定処理
  hitTestTreePlayer: function() {
    var player = this.player;
    var self = this;
    // 敵をループ
    this.treeGroup.children.each(function(tree) {
      // 判定用の円
      var c1 = Circle(tree.x,tree.y,60);
      var c2 = Circle(player.x,player.y,50); 
      // 円判定
      if(Collision.testCircleCircle(c1,c2)){
        self.exit();
      }
    });
  },
  update: function(){
    this.hitTestOrangePlayer();
    this.hitTestTreePlayer();
    this.label_score.text = 'score：' + score;
  }
});

// Playerクラス
phina.define('Player',{
  superClass: 'Sprite',
  init:function(){
    this.superInit('torokko',100,100);
    this.setInteractive(true); // タッチ可能にする
  },
  update: function(app) {
    //　移動処理
    var p = app.pointer;
    this.x = p.x;
    // 画面外はみ出し判定
    if (this.left < 0) {
      this.left = 0;
      this.physical.velocity.x *= -1;
    }else if (this.right > SCREEN_WIDTH) {
      this.right = SCREEN_WIDTH;
      this.physical.velocity.x *= -1;
    }
  },
});

// Treeクラス
phina.define('Tree',{
  superClass: 'Sprite',
  init:function(){
    this.superInit('tree',140,140);
    this.x =　Random.randint(50,SCREEN_WIDTH - 100);
    this.y = SCREEN_HEIGHT;
    this.physical.velocity.y = speed;
  },
  update: function(){
    if (this.top < 0) {
      this.remove();
    }
  }
});

// Orangeクラス
phina.define('Orange',{
  superClass: 'Sprite',
  init:function(){
    this.superInit('orange',70,70);
    this.x =　Random.randint(50,SCREEN_WIDTH - 100);
    this.y = SCREEN_HEIGHT;
    this.physical.velocity.y = speed;
  },
  update: function(){
    if (this.top < 0) {
      this.remove();
    }
  }
});

//resultScene クラスを定義
phina.define("ResultScene", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    Label({
      text: 'score：' + score,
      fontSize: 60,
      fill: '#000000',
    }).addChildTo(this).setPosition(this.gridX.center(),this.gridY.span(4));
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
