<?
	

$mysqli = new mysqli("localhost", "d02227b3", "123456", "d02227b3");

if ($mysqli->connect_errno) {
	
	echo "Error: Failed to make a MySQL connection, here is why: \n";
    echo "Errno: " . $mysqli->connect_errno . "\n";
    echo "Error: " . $mysqli->connect_error . "\n";
    
}

echo '<h1>new mysqli</h1><pre>';
print_r( $mysqli );
echo '</pre>';






if ( !$result = $mysqli->query("SELECT * FROM `task`") ) {
	
	echo "Error: Our query failed to execute and here is why: \n";
    echo "Errno: " . $mysqli->connect_errno . "\n";
    echo "Error: " . $mysqli->connect_error . "\n";
}

echo '<h1>query</h1><pre>';
print_r( $result );
echo '</pre>';







if ( $result->num_rows > 0 ) {
	
	echo '<h1>fetch_assoc</h1>';
	while ($row = $result->fetch_assoc()) {
		echo '<pre>';
		print_r( $row );
		echo '</pre>';
	}

}
	
?>