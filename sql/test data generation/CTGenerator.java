import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;
import java.io.BufferedReader;
import java.io.BufferedWriter;

public class CTGenerator {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter log = new BufferedWriter(new OutputStreamWriter(System.out));
        String line = br.readLine();

        int counter = 0;
        String name = "testct";
        String area = "'Kent Ridge'";
        System.out.println("INSERT INTO caretaker VALUES ");
        while (line != null) {
            String[] separate = line.split(" ");
            String email = "'" + separate[0] + "'";
            String cname = "'" + name + counter + "'";
            String phonenum = String.format("'%08d'", (long) (counter));
            System.out.println(String.format("(%s, %s, %s, NULL, 5, 'full time', %s), ", email, cname, phonenum, area));
            counter += 9;
            line = br.readLine();
        }
    }
}