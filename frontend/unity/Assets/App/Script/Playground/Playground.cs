using System;
using UnityEngine;
using Api_PB.V1_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB;
using Api_PB.V1_PB.App_PB.Authentication_PB.AuthenticationService_PB;
using Api_PB.V1_PB.App_PB.User_PB;
using Api_PB.V1_PB.App_PB.User_PB.UserService_PB;
using Api_PB.V1_PB.Health_PB;
using Api_PB.V1_PB.Health_PB.HealthService_PB;
using App.Script.Shared.Api;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class Playground : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    async void Start()
    {
        var loginId = DateTime.Now.Ticks.ToString();
        var password = "password";
        var s = new Session();
        s.SetBaseUrl("http://localhost:3000");
        
        await AuthenticationService.PasswordRegister(s, new PasswordRegisterRequest
        {
            loginId = loginId,
            password = password,
        });

        var r = await AuthenticationService.PasswordLogin(s, new PasswordLoginRequest
        {
            clientType = ClientType_String.Mobile,
            loginId = loginId,
            password = password,
        });

        s.SetAuthorization(r.responseBody.accessToken);

        await UserService.CreateUser(s, new CreateUserRequest
        {
            displayName = "my name"
        });
    }
}