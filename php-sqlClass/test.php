<?php

  class Database {

    private $db_host = "";
    private $db_user = "";
    private $db_pass = "";
    private $db_name = "";

    private $con = false;

    function __construct($host, $user, $pass, $name) {

        $this->db_host = $host;
        $this->db_user = $user;
        $this->db_pass = $pass;
        $this->db_name = $name;

    }

    public function connect () {

      if (!$this->db_host || !$this->db_user || !$this->db_pass || !$this->db_name ) {
        echo 'Missing Data';
        return false;
      }
      $this->con = new mysqli($this->db_host, $this->db_user, $this->db_pass, $this->db_name);

      if ($this->con->connect_errno) {
        $this->error();
        return false;
      }

    }

    public function error () {
      echo "Errno: " . $this->con->connect_errno . "<br> Error: " . $this->con->connect_error;
    }





    public function select ($table, $rows = '*', $where = null , $order = null ) {

      if ( !$table ) {
        return false;
      }

      $q = "SELECT ".$rows." FROM ".$table;

      if ($where) {
        $q .= " WHERE ".$where;
      }

      if ($order) {
        $q .= " ORDER BY ".$order;
      }


      $myreturn = $this->query($q);
    }



    private function query($q) {

      if (!$q) {
        return false;
      }


      if ( !$result = $this->con->query($q) ) {
        $this->error();
        return false;
      }

      if ($result) {
        $ret = array();
        while ($row = $result->fetch_assoc()) {
          array_push($ret, $row);
        }
      }

      return $ret;


    }


  }




$test = new Database('localhost', 'use', '123456', 'dbn');
$test->connect();

$test->select('task', 'id,time');

?>
