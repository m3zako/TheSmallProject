<?php
	$inData = getRequestInfo();
	
	$Name = $inData["Name"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "RootUser", "COP4331Group19", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		$stmt = $conn->prepare("INSERT INTO Contacts(Name, Phone, Email, UserID) VALUES(?, ?, ?, ?)");
		$stmt->bind_param("ssss", $Name, $Phone, $Email, $UserID);
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
