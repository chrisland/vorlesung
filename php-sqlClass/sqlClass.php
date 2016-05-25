<?


include_once 'Database.php';

$db = new Database("localhost", "d02227b3", "123456", "d02227b3");
$db->connect();


//$db->insert('task', array('task' => 'HIER MEIN TASK', 'time' => time() ));

$data = $db->select('task','id, task', null, 'id');



echo '<pre>';
print_r( $data );
echo '</pre>';
