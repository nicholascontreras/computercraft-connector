# import socket

# server_socket = socket.create_server(('', 80))
# server_socket.listen()

# minecraft_connection = None

# while True:

#     print('waiting for connection')
#     socket, address = server_socket.accept()
#     print('connection received')
#     socket.sendall(b'hello')
#     socket.close()

    # if not minecraft_connection:
    #     minecraft_connection = socket
    #     print('Minecraft connection established')
    # else:
    #     while True:
    #         data = socket.recv(1024)
    #         if data:
    #             minecraft_connection.sendall(data)
    #         else: 
    #             break

    #     while True:
    #         data = minecraft_connection.recv(1024)
    #         if data:
    #             socket.sendall(data)
    #         else: 
    #            break

    #     socket.close()

# Method called to handle web requests
def run_server(environ, start_response):

    start_response("200 OK", [
        ("Content-Type", "text/plain"),
        ("Content-Length", str(len(bytes("Hello World!"))))
    ])
    return bytes("Hello World!")