<?

class Database {
	
	
	private $db_host = "localhost";
	private $db_user = "";
	private $db_pass = "";
	private $db_name = "";

	
	private $con = false;
	
	function __construct($host, $user, $pass, $name) {
       
       if ($host) {
	       $this->db_host = $host;
       }
       if ($user) {
	       $this->db_user = $user;
       }
       if ($pass) {
	       $this->db_pass = $pass;
       }
       if ($name) {
	       $this->db_name = $name;
       }
    }
	
	public function connect() {
		
		if (!$this->db_host || !$this->db_user || !$this->db_pass || !$this->db_name ) {
			echo 'Error: Missing Connect Data';
			return false;
		}
		
		$this->con = new mysqli(	$this->db_host,
									$this->db_user,
									$this->db_pass,
									$this->db_name
		);

		
		if ($this->con->connect_errno) {
			$this->error("Error: Failed to make a MySQL connection, here is why: \n");
			return false;
		}
		
		return true;
	}
	
	
	
	
	
	public function select($table, $rows = '*', $where = null, $order = null) {
		
		if (!table) {
			return false;
		}
		
		$q = 'SELECT '.$rows.' FROM '.$table;
		
		
		if ($where) {
			$q .= ' WHERE '.$where;
		}
		
		if($order){
            $q .= ' ORDER BY '.$order;
		}
		
		return $this->query($q);
	}
	
	public function insert($table, $params = array() ) {
		
		if (!table) {
			return false;
		}
		
		$q = $sql='INSERT INTO `'.$table.'` (`'.implode('`, `',array_keys($params)).'`) VALUES ("' . implode('", "', $params) . '")';

		
		return $this->query($q);
	}
	

	private function query($q) {
	
		if (!$q) {
			return false;
		}	
		
		if ( !$result = $this->con->query($q) ) {
			$this->error("Error: Our query failed to execute and here is why: \n");
			return false;
		}

		
		if (!$result) {
			$this->error('Error!');
			return false;
		} else if ( $result->num_rows < 1 ) {
			return '';
		} else {
			
			$ret = array();
			while ($row = $result->fetch_assoc()) {
				array_push($ret, $row);
			}
			return $ret;
		}
	}
	
	private function error($msg) {
		
		echo '<div style="color:red;">';
		if ($msg) {
			echo '<div style="font-size:120%;">'.$msg.'</div>';
		}
		echo "Errno: " . $this->con->connect_errno."<br>Error: " . $this->con->connect_error;
		echo '</div>';
	}

	
	
}	

	
?>