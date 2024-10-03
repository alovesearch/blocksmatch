import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/pwa")
public class MyPWAServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html; charset=UTF-8");

        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html lang=\"ru\">");
        out.println("<head>");
        out.println("<meta charset=\"UTF-8\">");
        out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        out.println("<meta name=\"viewport\" content=\"width=device-width, user-scalable=no\">");
        out.println("<title>Блоки</title>");
        out.println("<link rel=\"stylesheet\" href=\"u30.css\">");
        out.println("<link rel=\"manifest\" href=\"manifest.json\">");
        out.println("<script>");
        out.println("if ('serviceWorker' in navigator) {");
        out.println(" navigator.serviceWorker.register('/service-worker.js')");
        out.println(".then((registration) => { console.log('Service Worker registered with scope:', registration.scope); })");
        out.println(".catch((error) => { console.log('Service Worker registration failed:', error); });");
        out.println("}");
        out.println("</script>");
        out.println("</head>");
        out.println("<body>");
        out.println("<!--<button id=\"playButton\">Воспроизвести аудио</button>-->");
        out.println("<div class=\"backb\">");
        out.println("<div class=\"board\" id=\"board\"></div>");
        out.println("</div>");
        out.println("<script type=\"text/javascript\" src=\"u32-2-A0.js\"></script>");
        out.println("<script>");
        out.println("function onLoad() {");
        out.println("console.log('Все ресурсы загружены');");
        out.println("}");
        out.println("document.addEventListener('DOMContentLoaded', onLoad);");
        out.println("</script>");
        out.println("</body>");
        out.println("</html>");
    }
}
