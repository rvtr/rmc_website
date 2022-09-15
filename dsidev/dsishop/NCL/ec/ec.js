/* ECError values */
var EC_ERROR_OK                   =     0;  /* No error */
var EC_ERROR_FAIL                 = -4001;  /* Generic error */
var EC_ERROR_NOT_SUPPORTED        = -4002;  /* Feature not implemented */
var EC_ERROR_INSUFICIENT_RESOURCE = -4003;
var EC_ERROR_INVALID              = -4004;
var EC_ERROR_NOMEM                = -4005;
var EC_ERROR_NOT_FOUND            = -4006;
var EC_ERROR_NOT_BUSY             = -4007;  /* no active async operation */
var EC_ERROR_BUSY                 = -4008;
var EC_ERROR_NOT_DONE             = -4009;
                                  
var EC_ERROR_NET_NA               = -4013;  /* Internet access not available */
var EC_ERROR_WS_REPORT            = -4015;  /* Server reports a problem */
var EC_ERROR_ECARD                = -4017;  /* Invalid eCard */
var EC_ERROR_OVERFLOW             = -4018;  /* Output too big for buf provided */
var EC_ERROR_NET_CONTENT          = -4019;  /* Error getting content from server */
var EC_ERROR_CONTENT_SIZE         = -4020;  /* Downloaded content size doesn't match tmd */
                                  
var EC_ERROR_WS_RESP              = -4034   /* invalid web service response */
var EC_ERROR_TICKET               = -4035;  /* problem importing ticket */
var EC_ERROR_TITLE                = -4036;  /* problem importing title */
var EC_ERROR_TITLE_CONTENT        = -4037;  /* problem importing title content */
var EC_ERROR_CANCELED             = -4038;  /* an extended operation was canceled */
var EC_ERROR_ALREADY              = -4039;  /* one time only action was previously done */

var EC_ERROR_INIT                 = -4041;  /* library has not been initialized */
var EC_ERROR_REGISTER             = -4042;  /* device is not registered */
var EC_ERROR_WS_RECV              = -4043;  /* recv error on web service response */
var EC_ERROR_NOT_ACTIVE           = -4044;  /* expected operation is not active op */
var EC_ERROR_FILE_READ            = -4045;
var EC_ERROR_FILE_WRITE           = -4046;

var EC_ERROR_DEVICE_KEY_PAIR      = -4047   /* problem importing device key pair */
var EC_ERROR_CERT_CHAIN           = -4048   /* problem importing cert chain */

var EC_ERROR_NOT_OWNED            = -4050;  /* Title is not owned */
var EC_ERROR_BAD_HEAP             = -4051;  /* An invalid heap was passed to eclib */
var EC_ERROR_HTTP_HDR_PARSE       = -4052;  /* Could not parse http header */
var EC_ERROR_CONFIG               = -4053;  /* Invalid configuration (e.g. url is invalid) */
var EC_ERROR_CANCEL_FAILED        = -4054;  /* Could not cancel asynchronous operaton */
var EC_ERROR_USER_INODES          = -4055;  /* Operation would exceed max user inodes */
var EC_ERROR_USER_BLOCKS          = -4056;  /* Operation would exceed max user blocks */
var EC_ERROR_SYS_INODES           = -4057;  /* Operation would exceed max sys inodes */
var EC_ERROR_SYS_BLOCKS           = -4058;  /* Operation would exceed max sys blocks */

var EC_ERROR_NO_DEVICE_CODE       = -4065;  /* Operation requires device code */
var EC_ERROR_SYNC                 = -4066;  /* Operation requires ticket sync */
var EC_ERROR_CONNECT              = -4069;  /* Operation requires EC_Connect() */
var EC_ERROR_NO_TMD               = -4070;  /* Title TMD is not on device */
var EC_ERROR_FIRMWARE             = -4071;  /* Title requires updated firmware */
var EC_ERROR_NO_DEVICE_KEY_PAIR   = -4072   /* Operation requires device key pair */

var EC_ERROR_PCPW                 = -4073;  /* Operation requires parental control password */
var EC_ERROR_INVALID_PCPW         = -4074;  /* Parental control password doesn't match */
var EC_ERROR_PC_DISABLED          = -4075;  /* Parental control is not enabled */
var EC_ERROR_EULA                 = -4076;  /* Customer has not agreed to EULA */

var EC_ERROR_RANGE_START          = -4000;
var EC_ERROR_RANGE_END            = -4199;

var EC_ISFS_ERROR_START           =  -101;
var EC_ISFS_ERROR_END             =  -199;
var EC_ES_ERROR_START             = -1000;
var EC_ES_ERROR_END               = -1999;
var EC_HTTP_STATUS_RANGE_START    = -4400;   /* corresponds to http status 100 */
var EC_HTTP_STATUS_RANGE_END      = -4899;
var EC_NHTTP_ERROR_RANGE_START    = -4900;
var EC_NHTTP_ERROR_RANGE_END      = -4959;
var EC_SSL_ERROR_RANGE_START      = -4960;
var EC_SSL_ERROR_RANGE_END        = -4979;
var EC_NHTTP_APIERR_RANGE_START   = -4980;
var EC_NHTTP_APIERR_RANGE_END     = -4999;

/* Unexpected NHTTP API errors */
var EC_ERROR_NHTTP_SMO            = -4990;
var EC_ERROR_NHTTP_SCA            = -4991;
var EC_ERROR_NHTTP_CRX            = -4992;
var EC_ERROR_NHTTP_AHF            = -4993;
var EC_ERROR_NHTTP_SCCD           = -4994;
var EC_ERROR_NHTTP_SRCD           = -4995;
var EC_ERROR_NHTTP_SVO            = -4996;
var EC_ERROR_NHTTP_PDE            = -4997;
var EC_ERROR_NHTTP_PDR            = -4998;
var EC_ERROR_NHTTP_SRA            = -4999;

/* -101 to - max ISFS error are ISFS errors
 * -1000 to - max ESError are errors returned by ES
 * -4400 to -4899 correspond to http status codes 100 to 599
 * -4900 to -4959 are NHTTPError values
 * -4960 to -4979 are values returned by NHTTPSSLGetError()
 * -4980 to -4999 are unexpected HHTTP API errors
 */ 


var EC_INVALID_ACCOUNT_ID = "";


var ECOPT_JS_TEST_MODE        = 0;  /* can never set from JavaScript */
var ECOPT_LOG_LEVEL           = 1;
var ECOPT_RE_DOWNLOAD_CONTENT = 2;
var ECOPT_INVALID             = 3;

var EC_JS_TM_OFF = 0;
var EC_JS_TM_ON  = 1;

var  EC_LOG_NONE    =  0;
var  EC_LOG_ERR     =  1;
var  EC_LOG_WARN    =  2;
var  EC_LOG_INFO    =  3;
var  EC_LOG_FINE    =  4;
var  EC_LOG_FINER   =  5;
var  EC_LOG_FINEST  =  6;
