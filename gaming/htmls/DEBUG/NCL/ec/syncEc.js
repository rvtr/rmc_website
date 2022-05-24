/*
  syncEc.js
  非同期処理の EC 関数を同期処理にしたりするラッパー
*/

/*
  指定ミリ秒間ブロッキングして待つ関数
  よい子はあまり真似しないように
*/
function wait_( time )
{
    var start = new Date();
    var now;
    do
    {
        now = new Date();
    } while ( now.getTime() - start.getTime() <= time );
}

/*
  非同期処理の EC を無理やり同期処理にする関数
  ec_func は eval で実行するので文字列として渡してください
  基本的に getProgress に対してしか使わないはずですが…
  例：
  var progress = SyncEc( "ec.getProgress()" );
*/
function SyncEc( ec_func )
{
    var progress;
    if ( ec_func == null || ec_func == undefined )
        return ( progress );
    
    progress = eval( ec_func );
    while ( progress.status == EC_ERROR_NOT_DONE )
    {
        wait_( 100 );
        progress = eval( ec_func );
    }
    return ( progress );
}

/*
  非同期処理の EC を指定したコールバック関数で通知する関数
  現在実装中
*/
function AsynEc( func, callback, interval )
{
    if ( interval < 0 )
        interval = 1;
    var progress = eval( ec_func );
    if ( progress.status == EC_ERROR_NOT_DONE )
    {
        setTimeout('AsynEc("' + func + '","' + callback + '","' + interval + '")', interval );
    }
    else
    {
        eval( callback + "( progress )" );
    }
}