# tdm_server
This api is developed for our mobile development project - Cars renting app -
<br/>
## Endpoints

<details>
 <summary><code>POST</code> <code><b>/login</b></code> <code>Login to cars renting app</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Phon Number |  required | String   | N/A  |
> | Password |  required | String   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | Login successfull with JWT token                                   |
> | `404`         | application/json                | User not found                                 |
> | `500`         | application/json                | Server error                                   |

</details>

<details>
 <summary><code>POST</code> <code><b>/register</b></code> <code>Create account in renting car app</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | phoneNumber           |  required | String   | N/A  |
> | creditCardNumber      |  required | String   | N/A  |
> | creditCardExpiration  |  required | String   | N/A  |
> | drivingLicense        |  required | String   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `400`         | application/json                | Information not complete               |
> | `400`         | application/json                | Phone number existe                    |
> | `200`         | application/json                | JWT token with the generated password                                 |
> | `500`         | application/json                | Server error                           |


</details>

<details>
 <summary><code>GET</code> <code><b>/api/users</b></code> <code>Get all users of the app</code></summary>

> Require authentication/authorization

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | List of users                                                         |
> | `500`         | application/json                | Server error                           |


</details>

<details>
 <summary><code>GET</code> <code><b>/api/cars</b></code> <code>Get all Cars</code></summary>

> Require authentication

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | List of cars                                                          |
> | `500`         | application/json                | Server error                           |
</details>



<details>
 <summary><code>GET</code> <code><b>/api/cars/:idCar</b></code> <code>Get car by id</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | idCar           |  required | String   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | One car                                                               |
> | `404`         | application/json                | Car not found                                                         |
> | `500`         | application/json                | Server error                                                          |

</details>


<details>
 <summary><code>GET</code> <code><b>/api/user/carsRented/:phone</b></code> <code>Get Cars rented by user</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | phone           |  required | String   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | List of cars rented                                                   |
> | `500`         | application/json                | Server error                                                          |

</details>

<details>
 <summary><code>POST</code> <code><b>/api/reserve/:phone/:idCar</b></code> <code>Reserve a car by id=idCar</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | phone |  required | String   | N/A  |
> | idCar |  required | String   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | List of cars rented                                                   |
> | `404`         | application/json                | Not Found                     |
> | `500`         | application/json                | Server error                         |

</details>

</details>


<details>
 <summary><code>POST</code> <code><b>/api/endreserve/:phone/:idCar</b></code> <code>End reservation of user with car of id=idCar</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | phone |  required | String   | N/A  |
> | idCar |  required | String   | N/A  |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | End reservation successfully                                          |
> | `404`         | application/json                | Car Not Found / User not found                                        |
> | `500`         | application/json                | Server error                           |

</details>



<details>
 <summary><code>POST</code> <code><b>/api/editinfo/:phone</b></code> <code>Edit user information</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | phone |  required | String   | N/A  |

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | phoneNumber |  Not required unless changed | String   | N/A  |
> | password |  Not required unless changed | String   | N/A  |
> | creditCardNumber |  Not required unless changed | String   | N/A  |



##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | application/json                | Edited Information                                                    |
> | `404`         | application/json                | User not found                                                        |
> | `500`         | application/json                | Information already exists in another user                            |
> | `500`         | application/json                | Server error                           |


</details>

<br/>

## API Documentation

You can see the documentation here: [API Documentation](https://app.swaggerhub.com/apis-docs/JIBOUROUCHE/tdm-project_api/2.0.0#/default/get_api_users)
<br/>
> NOTE:  The server is not deployed for the moment
