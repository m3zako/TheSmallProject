<?php
	$inData = getRequestInfo();
	
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$Name = $inData["Name"];
	$ID = $inData["ID"];

	$conn = new mysqli("localhost", "RootUser", "COP4331Group19", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		$stmt = $conn->prepare("UPDATE Contacts SET Phone = ?, Email = ?, Name = ? WHERE ID = ?");
		$stmt->bind_param("ssss", $Phone, $Email, $Name, $ID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>