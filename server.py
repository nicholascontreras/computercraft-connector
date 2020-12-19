import socket

server_socket = socket.create_server(('', 5678))
server_socket.listen()

# minecraft_connection = None

while True:

    print('waiting for socket connection')
    socket, address = server_socket.accept()
    print('socket connection received')
    socket.sendall(b'hello')
    socket.close()
    print('socket connection closed')

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
        ("Content-Length", str(len(bytes("Hello World!", 'utf-8'))))
    ])
    return [bytes("Hello World!", 'utf-8')]